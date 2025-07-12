import {
  getBearerTokenDuration,
  getSecretKey,
} from "../../shared/config/secret.ts";

import {
  deleteRefreshToken,
  getRefreshTokenByToken,
  insertRefreshToken,
} from "./repository.ts";

import { getRefreshTokenDuration } from "../../shared/config/secret.ts";
import jwt from "jsonwebtoken";
import { Client } from "mysql";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { compare as checkPassword } from "../../shared/services/hashService.ts";
import { getUserByEmail } from "../users/repository.ts";
import { Context } from "@hono/hono";

export const generateJwtToken = (email: string): string => {
  return jwt.sign({ email }, getSecretKey(), {
    expiresIn: getBearerTokenDuration(),
  });
};

export const validateUserCredentials = async (
  client: Client,
  email: string,
  password: string,
) => {
  const authRow = await getAuthenticationRowByEmail(client, email);
  if (!authRow) {
    throw new Error("User not found");
  }

  const isPasswordValid = checkPassword(password, authRow.password, authRow.salt);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return authRow;
};

export const fetchUserByEmail = async (client: Client, email: string) => {
  const user = await getUserByEmail(client, email);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const generateSecureToken = (length = 64) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

export const createAndStoreRefreshToken = async (
  client: Client,
  context: Context,
  userId: string,
) => {
  const refreshToken = generateSecureToken();
  const duration = getRefreshTokenDuration();
  const expiresAt = new Date(Date.now() + duration * 1000);
  await insertRefreshToken(client, {
    userId,
    token: refreshToken,
    expiresAt,
  });
  setRefreshTokenCookie(context, refreshToken, expiresAt);
};

export const rotateRefreshToken = async (
  client: Client,
  context: Context,
  oldToken: string,
  userId: string,
) => {
  await deleteRefreshToken(client, oldToken);
  return createAndStoreRefreshToken(client, context, userId);
};

export const getRefreshTokenData = (client: Client, token: string) => {
  return getRefreshTokenByToken(client, token);
};

export const setRefreshTokenCookie = (
  c: Context,
  refreshToken: string,
  expiresAt: Date,
) => {
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  c.res.headers.append(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${maxAge}`,
  );
};

export const getRefreshTokenFromCookie = (c: Context): string | undefined => {
  const cookie = c.req.header("Cookie");
  return cookie?.match(/refreshToken=([^;]+)/)?.[1];
};

export const revokeRefreshTokenCookie = (c: Context) => {
  c.res.headers.append(
    "Set-Cookie",
    "refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0",
  );
};
