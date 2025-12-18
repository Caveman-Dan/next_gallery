export const checkValidEmail = (email: string): boolean => {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed === "") return true; // to allow a different response to missing email

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(trimmed);
};
