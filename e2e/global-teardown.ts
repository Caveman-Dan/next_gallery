import mysql from "mysql2/promise";
import { tableName } from "@/lib/db/dbHelpers";

export default async function globalTeardown() {
  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const database = process.env.DATABASE_NAME;
  if (!host || !user || !database) return;

  const connection = await mysql.createConnection({
    host,
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user,
    password: process.env.DATABASE_PASSWORD ?? "",
    database,
  });

  try {
    const [result] = await connection.query(`DELETE FROM ${tableName("users")} WHERE email LIKE ?`, [
      "e2e-%@example.com",
    ]);
    const removed = "affectedRows" in result ? result.affectedRows : 0;
    console.log(`
    
    Teardown
    ========
    Removed ${removed} e2e test user(s) from database
    
    `);
  } finally {
    await connection.end();
  }
}
