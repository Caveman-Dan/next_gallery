import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { getTablePrefix } from "@/lib/db/dbHelpers";

export const BACKUP_DIR = path.join(process.cwd(), "db", "backups");

const dbEnv = () => {
  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD ?? "";
  const database = process.env.DATABASE_NAME;
  const port = String(process.env.DATABASE_PORT ?? 3306);
  if (!host || !user || !database) {
    throw new Error("Missing DATABASE_HOST, DATABASE_USER, or DATABASE_NAME in env.");
  }
  return { host, user, password, database, port };
};

export const listAppTables = async (connection: mysql.Connection) => {
  const prefix = getTablePrefix();
  const [rows] = prefix
    ? await connection.query("SHOW TABLES LIKE ?", [`${prefix}%`])
    : await connection.query("SHOW TABLES");
  return (rows as Record<string, string>[]).map((row) => Object.values(row)[0]).filter(Boolean);
};

export const backupAppTables = async (connection: mysql.Connection, label: string) => {
  const tables = await listAppTables(connection);
  if (!tables.length) {
    console.log("No Next Gallery tables to back up yet.");
    return null;
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(BACKUP_DIR, `${stamp}_${label}.sql`);
  const { host, user, password, database, port } = dbEnv();

  await new Promise<void>((resolve, reject) => {
    const out = fs.createWriteStream(filePath);
    const child = spawn(
      "mysqldump",
      [
        `--host=${host}`,
        `--port=${port}`,
        `--user=${user}`,
        "--single-transaction",
        "--skip-comments",
        database,
        ...tables,
      ],
      { env: { ...process.env, MYSQL_PWD: password }, stdio: ["ignore", "pipe", "pipe"] }
    );
    child.stdout.pipe(out);
    const errChunks: Buffer[] = [];
    child.stderr.on("data", (chunk) => errChunks.push(chunk as Buffer));
    child.on("error", reject);
    child.on("close", (code) => {
      out.close();
      if (code !== 0) {
        reject(new Error(errChunks.join("") || `mysqldump exited ${code}`));
        return;
      }
      resolve();
    });
  });

  console.log(`Backup written: ${filePath}`);
  return filePath;
};

const isCli = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

const main = async () => {
  const { host, user, password, database, port } = dbEnv();
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port: Number(port),
  });
  try {
    await backupAppTables(connection, "manual");
  } finally {
    await connection.end();
  }
};

if (isCli) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Backup failed");
    process.exit(1);
  });
}
