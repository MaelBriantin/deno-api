import {
  deleteRefreshToken,
  getRefreshTokenByToken,
  insertRefreshToken,
} from "./repository.ts";

import { getRefreshTokenDuration } from "../../common/config/secret.ts";
import { Client } from "mysql";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { compare as checkPassword } from "../../common/services/hashService.ts";
import { Context } from "@hono/hono";
import { AuthenticationError, AuthenticationErrorCode } from "./error.ts";
import {
  generateJwtToken,
  generateSecureToken,
} from "../../common/services/tokenService.ts";
import { getClient } from "../../common/config/db.ts";
import { createUserService } from "../users/application/userService.ts";
import { createUserRepository } from "../users/infrastructure/userRespository.ts";

const userService = createUserService(createUserRepository(await getClient()));

export const loginService = async (
  context: Context,
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
    const client = await getClient();
    await validateUserCredentials(email, password, client);
    const fetchedUser = await fetchUserByEmail(email, client);
    const token = generateJwtToken(email);
    const user = fetchedUser.user;
    if (!user) {
      throw new AuthenticationError(
        "User not found",
        AuthenticationErrorCode.USER_NOT_FOUND,
      );
    }
    await createAndStoreRefreshToken(client, context, user.id);
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
  email: string,
  password: string,
  client: Client,
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

export const fetchUserByEmail = async (email: string, client?: Client) => {
  if (!client) {
    client = await getClient();
  }
  const user = await userService.getUserByEmail(email);
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
  context: Context,
  oldToken: string,
  userId: string,
) => {
  const client = await getClient();
  await deleteRefreshToken(client, oldToken);
  return createAndStoreRefreshToken(client, context, userId);
};

export const getRefreshTokenData = async (token: string, client?: Client) => {
  if (!client) {
    client = await getClient();
  }
  return getRefreshTokenByToken(client, token);
};

export const deleteRefreshTokenService = async (
  token: string,
  client?: Client,
) => {
  if (!client) {
    client = await getClient();
  }
  await deleteRefreshToken(client, token);
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
