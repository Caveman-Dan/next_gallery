import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const MIGRATIONS_DIR = path.join(process.cwd(), "db", "migrations");

type Direction = "up" | "down";

const getConnection = async () => {
  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD ?? "";
  const database = process.env.DATABASE_NAME;
  const port = Number(process.env.DATABASE_PORT ?? 3306);

  if (!host || !user || !database) {
    throw new Error("Missing DATABASE_HOST, DATABASE_USER, or DATABASE_NAME in env.");
  }

  return mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });
};

const ensureMigrationsTable = async (connection: mysql.Connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(32) NOT NULL PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const listMigrationFiles = (direction: Direction) => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(`Missing migrations folder: ${MIGRATIONS_DIR}`);
  }

  const suffix = `.${direction}.sql`;
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(suffix))
    .sort()
    .map((name) => {
      const version = name.slice(0, name.indexOf("_"));
      return { version, name, filePath: path.join(MIGRATIONS_DIR, name) };
    });
};

const getAppliedVersions = async (connection: mysql.Connection) => {
  const [rows] = await connection.query("SELECT version FROM schema_migrations ORDER BY version ASC");
  return new Set((rows as { version: string }[]).map((row) => row.version));
};

const migrateUp = async (connection: mysql.Connection) => {
  const applied = await getAppliedVersions(connection);
  const pending = listMigrationFiles("up").filter((file) => !applied.has(file.version));

  if (!pending.length) {
    console.log("No pending migrations.");
    return;
  }

  for (const file of pending) {
    const sql = fs.readFileSync(file.filePath, "utf8");
    console.log(`Applying ${file.name}`);
    await connection.query(sql);
    await connection.query("INSERT INTO schema_migrations (version) VALUES (?)", [file.version]);
  }
};

const migrateDown = async (connection: mysql.Connection) => {
  const applied = [...(await getAppliedVersions(connection))];
  const lastVersion = applied.at(-1);

  if (!lastVersion) {
    console.log("No applied migrations to roll back.");
    return;
  }

  const file = listMigrationFiles("down").find((entry) => entry.version === lastVersion);
  if (!file) {
    throw new Error(`No down migration for version ${lastVersion}`);
  }

  const sql = fs.readFileSync(file.filePath, "utf8");
  console.log(`Rolling back ${file.name}`);
  await connection.query(sql);
  await connection.query("DELETE FROM schema_migrations WHERE version = ?", [lastVersion]);
};

const main = async () => {
  const direction = process.argv[2];
  if (direction !== "up" && direction !== "down") {
    throw new Error('Usage: tsx db/migrate.ts <up|down>');
  }

  const connection = await getConnection();
  try {
    await ensureMigrationsTable(connection);
    if (direction === "up") {
      await migrateUp(connection);
    } else {
      await migrateDown(connection);
    }
  } finally {
    await connection.end();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Migration failed";
  console.error(message);
  process.exit(1);
});
