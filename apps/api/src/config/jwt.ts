import fs from 'fs';
import path from 'path';

interface JwtConfig {
  publicKey: string;
  privateKey: string;
}

export const jwtConfig: JwtConfig = (() => {
  // Check if environment variables are provided
  const envPublicKey = process.env.JWT_PUBLIC_KEY;
  const envPrivateKey = process.env.JWT_SECRET_KEY;

  if (envPublicKey && envPrivateKey) {
    return {
      publicKey: envPublicKey,
      privateKey: envPrivateKey
    };
  }

  // Fall back to reading from .keys directory
  const keysDir = path.join(process.cwd(), '.keys');
  const publicKeyPath = path.join(keysDir, 'jwtRS256.key.pub');
  const privateKeyPath = path.join(keysDir, 'jwtRS256.key');

  try {
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    return {
      publicKey,
      privateKey
    };
  } catch (error) {
    throw new Error(
      `Failed to load JWT keys. Please ensure environment variables JWT_PUBLIC_KEY and JWT_SECRET_KEY are set, ` +
      `or run 'pnpm run generate:jwt-keys' to generate key files. Error: ${error}`
    );
  }
})();
