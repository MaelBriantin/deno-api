import {
  deleteRefreshToken,
  getRefreshTokenByToken,
  insertRefreshToken,
} from "./repository.ts";

import { getRefreshTokenDuration } from "../../shared/config/secret.ts";
import { Client } from "mysql";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { compare as checkPassword } from "../../shared/services/hashService.ts";
import { getUserByEmail } from "../users/repository.ts";
import { Context } from "@hono/hono";
import { AuthenticationError, AuthenticationErrorCode } from "./error.ts";
import {
  generateJwtToken,
  generateSecureToken,
} from "../../shared/services/tokenService.ts";

export const loginService = async (
  client: Client,
  email: string,
  password: string,
) => {
  if (!email || !password) {
    return {
      user: null,
      error: new AuthenticationError(
        "Email and password are required",
        AuthenticationErrorCode.INVALID_CREDENTIALS,
      ).toJson(),
      status: 400,
    };
  }
  try {
    await validateUserCredentials(client, email, password);
    const user = await fetchUserByEmail(client, email);
    const token = generateJwtToken(email);
    return {
      user,
      token,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return {
        user: null,
        error: error.toJson(),
        status: 401,
      };
    }
    return {
      user: null,
      error: new AuthenticationError(
        "Invalid credentials",
        AuthenticationErrorCode.INVALID_CREDENTIALS,
      ).toJson(),
      status: 401,
    };
  }
};

export const validateUserCredentials = async (
  client: Client,
  email: string,
  password: string,
) => {
  const authRow = await getAuthenticationRowByEmail(client, email);
  if (!authRow) {
    throw new AuthenticationError(
      "User not found",
      AuthenticationErrorCode.USER_NOT_FOUND,
    );
  }

  const isPasswordValid = checkPassword(
    password,
    authRow.password,
    authRow.salt,
  );
  if (!isPasswordValid) {
    throw new AuthenticationError(
      "Invalid password",
      AuthenticationErrorCode.INVALID_PASSWORD,
    );
  }

  return authRow;
};

export const fetchUserByEmail = async (client: Client, email: string) => {
  const user = await getUserByEmail(client, email);
  if (!user) {
    throw new AuthenticationError(
      "User not found",
      AuthenticationErrorCode.USER_NOT_FOUND,
    );
  }
  return user;
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
