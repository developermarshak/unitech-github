import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

/**
 * PasswordHasher provides utilities to securely hash and verify passwords using
 * Node's built-in crypto.scrypt algorithm. The resulting hash is stored as
 * "salt:derivedKey" (both hex-encoded).
 */
export class PasswordHasher {
  private readonly keyLength = 32; // 32 bytes → 256 bits

  /**
   * Generates a salted hash for the provided plain-text password.
   */
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * Verifies whether a plain-text password matches a previously generated hash.
   */
  async verify(password: string, storedHash: string): Promise<boolean> {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;
    const keyBuffer = Buffer.from(keyHex, 'hex');

    // Protect against timing attacks
    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }
    return timingSafeEqual(derivedKey, keyBuffer);
  }
}
