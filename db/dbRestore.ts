import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BACKUP_DIR = path.join(process.cwd(), "db", "backups");

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

const resolveBackupFile = (input?: string) => {
  if (!input) {
    throw new Error("Usage: npm run db:restore -- <backup.sql>");
  }
  const filePath = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
  if (!filePath.startsWith(BACKUP_DIR) && path.dirname(filePath) !== BACKUP_DIR) {
    // allow paths under db/backups, or an explicit path the user passed
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Backup not found: ${filePath}`);
  }
  if (!filePath.endsWith(".sql")) {
    throw new Error("Restore file must be a .sql dump");
  }
  return filePath;
};

const restoreDump = (filePath: string) => {
  const { host, user, password, database, port } = dbEnv();
  return new Promise<void>((resolve, reject) => {
    const child = spawn("mysql", [`--host=${host}`, `--port=${port}`, `--user=${user}`, database], {
      env: { ...process.env, MYSQL_PWD: password },
      stdio: ["pipe", "inherit", "pipe"],
    });
    fs.createReadStream(filePath).pipe(child.stdin);
    const errChunks: Buffer[] = [];
    child.stderr.on("data", (chunk) => errChunks.push(chunk as Buffer));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(errChunks.join("") || `mysql exited ${code}`));
        return;
      }
      resolve();
    });
  });
};

const main = async () => {
  const filePath = resolveBackupFile(process.argv[2]);
  console.log(`Restoring ${filePath}`);
  await restoreDump(filePath);
  console.log("Restore complete.");
};

const isCli = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Restore failed");
    process.exit(1);
  });
}
