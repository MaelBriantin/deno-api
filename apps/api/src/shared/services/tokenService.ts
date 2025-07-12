import { randomBytes } from "@noble/hashes/utils";
import { getBearerTokenDuration, getSecretKey } from "../config/secret.ts";
import jwt from "jsonwebtoken";
import { encodeBase64 } from "@std/encoding/base64";

export const generateJwtToken = (email: string): string => {
  return jwt.sign({ email }, getSecretKey(), {
    expiresIn: getBearerTokenDuration(),
  });
};

export const generateSecureToken = (length: number = 64): string => {
  return encodeBase64(randomBytes(length));
};
