const IDENTIFIER_PATTERN = /^[A-Za-z0-9_]+$/;
const PREFIX_PATTERN = /^[A-Za-z0-9_]*$/;

export const assertIdentifier = (value: string, label: string) => {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`${label} may only contain letters, numbers, and underscores.`);
  }
};

export const getTablePrefix = () => {
  const prefix = process.env.DATABASE_PREFIX ?? "";
  if (!PREFIX_PATTERN.test(prefix)) {
    throw new Error("DATABASE_PREFIX may only contain letters, numbers, and underscores.");
  }
  return prefix;
};

export const tableName = (name: string) => {
  assertIdentifier(name, "Table name");
  return `${getTablePrefix()}${name}`;
};

export const applyTablePrefix = (sql: string) => sql.replaceAll("__PREFIX__", getTablePrefix());
