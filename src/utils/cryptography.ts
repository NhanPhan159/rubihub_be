import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

const SALT_LENGTH = 32;

export const generateSalt = (): Buffer => {
  return randomBytes(SALT_LENGTH);
};

/**
 * Hashes a password using Argon2.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(
  password: string,
  salt?: Buffer,
): Promise<string> {
  const hashedPassword = await argon2.hash(password, { salt });

  return hashedPassword;
}

/**
 * Verifies a password against a hashed password.
 * @param hashedPassword - The hashed password to compare against.
 * @param password - The plain text password to verify.
 * @param salt - The salt used to hash the password.
 * @returns True if the password matches the hash, false otherwise.
 */
export async function verifyPassword({
  hashedPassword,
  password,
}: {
  hashedPassword: string;
  password: string;
}): Promise<boolean> {
  const isPasswordValid = await argon2.verify(hashedPassword, password);

  return isPasswordValid;
}
