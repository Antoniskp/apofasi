/**
 * Password hashing and verification utilities
 * Uses Node.js crypto module for secure password handling
 */

import crypto from "crypto";

const SCRYPT_PATTERN = /^[a-f0-9]{32}:[a-f0-9]{128}$/i;

export const isScryptHash = (storedValue) =>
  typeof storedValue === "string" && SCRYPT_PATTERN.test(storedValue);

/**
 * Hash a password using scrypt
 * @param {string} password - Plain text password
 * @returns {string} Hashed password in format "salt:hash"
 */
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

/**
 * Verify a password against stored hash
 * @param {string} password - Plain text password to verify
 * @param {string} storedValue - Stored hash in format "salt:hash"
 * @returns {boolean} True if password matches
 */
export const verifyPassword = (password, storedValue) => {
  if (!storedValue) return false;

  if (isScryptHash(storedValue)) {
    const [salt, key] = storedValue.split(":");
    if (!salt || !key) return false;

    const derivedKey = crypto.scryptSync(password, salt, 64);
    try {
      return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
    } catch {
      return false;
    }
  }

  const legacyBuffer = Buffer.from(String(storedValue));
  const inputBuffer = Buffer.from(String(password));
  if (legacyBuffer.length !== inputBuffer.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(legacyBuffer, inputBuffer);
  } catch {
    return false;
  }
};

export const needsPasswordUpgrade = (storedValue) => !isScryptHash(storedValue);
