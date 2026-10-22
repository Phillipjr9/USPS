import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing helpers.
 *
 * Kept in their own module so the database bootstrap can create the
 * administrator account without importing the auth layer (which imports the
 * database layer, and would otherwise form a cycle).
 */

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
