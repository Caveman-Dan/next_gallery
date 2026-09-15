import mysql from "mysql2/promise";
import { applyTablePrefix } from "@/lib/db/dbHelpers";

let pool: mysql.Pool | undefined;

const getPool = () => {
  if (!pool) {
    const host = process.env.DATABASE_HOST;
    const user = process.env.DATABASE_USER;
    const database = process.env.DATABASE_NAME;
    if (!host || !user || !database) {
      throw new Error("Missing DATABASE_HOST, DATABASE_USER, or DATABASE_NAME in env.");
    }
    pool = mysql.createPool({
      host,
      port: Number(process.env.DATABASE_PORT ?? 3306),
      user,
      password: process.env.DATABASE_PASSWORD ?? "",
      database,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
};

export const dbQuery = async <T = mysql.RowDataPacket[]>(sql: string, params?: unknown[]) => {
  const [rows] = await getPool().query(applyTablePrefix(sql), params);
  return rows as T;
};
