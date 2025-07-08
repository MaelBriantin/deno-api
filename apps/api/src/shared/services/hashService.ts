import { argon2d } from "@noble/hashes/argon2";
import { getSalt } from "../config/secret.ts";

const noSaltError =
  "No salt provided. You must provide a salt or set the ARGON2_SALT environment variable.";

export const hash = (password: string, salt?: string): string => {
  salt = salt || getSalt();
  if (!salt) throw new Error(noSaltError);
  const encoder = new TextEncoder();
  const saltBytes = encoder.encode(salt);
  if (saltBytes.length !== 8) throw new Error("Bad salt length");

  const hashBytes = argon2d(password, saltBytes, {
    t: 2,
    m: 65536,
    p: 1,
    maxmem: 2 ** 32 - 1,
  });
  return btoa(String.fromCharCode(...hashBytes));
};

export const compare = (
  string: string,
  hashedString: string,
  salt?: string,
): boolean => {
  salt = salt || getSalt();
  if (!salt) throw new Error(noSaltError);
  const hashed = hash(string, salt);
  return hashed === hashedString;
};
