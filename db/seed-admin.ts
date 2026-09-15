import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mysql from "mysql2/promise";
import { tableName } from "@/db/dbHelpers";
import { hashPassword } from "@/lib/password";

const readHidden = async (prompt: string) => {
  output.write(prompt);
  input.setRawMode?.(true);
  input.resume();
  input.setEncoding("utf8");

  let value = "";
  return await new Promise<string>((resolve, reject) => {
    const onData = (char: string) => {
      // Enter, or Ctrl-D. Restore the terminal, print a newline, and return the password
      if (char === "\n" || char === "\r" || char === "\u0004") {
        cleanup();
        output.write("\n");
        resolve(value);
        return;
      }
      // Ctrl-C. Restore the terminal and abort
      if (char === "\u0003") {
        cleanup();
        reject(new Error("Cancelled"));
        return;
      }
      // Backspace - Drop the last character
      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      // All other characters append to value
      value += char;
    };
    const cleanup = () => {
      input.setRawMode?.(false);
      input.off("data", onData);
    };
    input.on("data", onData);
  });
};

const main = async () => {
  const rl = createInterface({ input, output });
  const email = (await rl.question("Admin email: ")).trim();
  rl.close();

  if (!email) {
    throw new Error("Email is required");
  }

  const password = await readHidden("Admin password: ");
  const password2 = await readHidden("Confirm password: ");
  if (!password) {
    throw new Error("Password is required");
  }
  if (password !== password2) {
    throw new Error("Passwords do not match");
  }

  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const dbPassword = process.env.DATABASE_PASSWORD ?? "";
  const database = process.env.DATABASE_NAME;
  const port = Number(process.env.DATABASE_PORT ?? 3306);

  if (!host || !user || !database) {
    throw new Error("Missing DATABASE_HOST, DATABASE_USER, or DATABASE_NAME in env.");
  }

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password: dbPassword,
    database,
  });

  try {
    const usersTable = tableName("users");
    const [existing] = await connection.query(`SELECT id FROM ${usersTable} WHERE role = 'admin' LIMIT 1`);
    if (Array.isArray(existing) && existing.length > 0) {
      throw Error("An admin user already exists.");
    }

    const passwordHash = await hashPassword(password);
    await connection.query(
      `INSERT INTO ${usersTable} (email, password_hash, role, status) VALUES (?, ?, 'admin', 'active')`,
      [email, passwordHash]
    );
    console.log(`Created admin user: ${email}`);
  } finally {
    await connection.end();
    process.stdin.setRawMode?.(false);
    process.stdin.pause();
  }
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Failed to seed admin";
    console.error(message);
    process.exit(1);
  });
