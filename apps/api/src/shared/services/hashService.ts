import { argon2d } from "@noble/hashes/argon2";
import { randomBytes } from "@noble/hashes/utils";
import { encodeBase64 } from "@std/encoding/base64";

export const hash = (
  password: string,
  salt?: string,
): { salt: string; hashedPassword: string } => {
  salt = salt || generateSalt(16);
  const hashBytes = argon2d(password, salt, {
    t: 2,
    m: 65536,
    p: 1,
    maxmem: 2 ** 32 - 1,
  });
  return { salt, hashedPassword: encodeBase64(hashBytes) };
};

export const compare = (
  string: string,
  hashedString: string,
  salt: string,
): boolean => {
  const { hashedPassword } = hash(string, salt);
  return hashedPassword === hashedString;
};

export const generateSalt = (length: number = 16): string => {
  return encodeBase64(randomBytes(length));
};
