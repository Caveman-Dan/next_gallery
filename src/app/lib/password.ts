import argon2 from "argon2";

const ARGON2_OPTIONS = {
  type: argon2.argon2id as 0 | 1 | 2,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
};

export const hashPassword = async (password: string) => {
  return argon2.hash(password, ARGON2_OPTIONS);
};

export const verifyPassword = async (password: string, stored: string) => {
  try {
    return await argon2.verify(stored, password);
  } catch {
    return false;
  }
};

// Argon2 can read old hashes if, in the future, you decide to increase
// the cost. This is so you can rehash old passwords afterwards.
export const passwordNeedsRehash = (stored: string) => {
  return argon2.needsRehash(stored, ARGON2_OPTIONS);
};
