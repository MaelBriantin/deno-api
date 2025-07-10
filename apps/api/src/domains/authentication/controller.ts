import { Context } from "@hono/hono";
import { Client } from "mysql";
import {
  createAndStoreRefreshToken,
  fetchUserByEmail,
  generateJwtToken,
  getRefreshTokenData,
  getRefreshTokenFromCookie,
  revokeRefreshTokenCookie,
  rotateRefreshToken,
  validateUserCredentials,
} from "./service.ts";
import { deleteRefreshToken } from "./repository.ts";

export const login = async (c: Context, client: Client) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  try {
    await validateUserCredentials(client, email, password);

    const jwtToken = generateJwtToken(email);
    const user = await fetchUserByEmail(client, email);
    await createAndStoreRefreshToken(client, c, user.id);
    return c.json({ message: "Login successful", user, token: jwtToken }, 200);
  } catch (error) {
    const errorMessage = (error instanceof Error)
      ? error.message
      : String(error);
    return c.json({ error: errorMessage }, 401);
  }
};

export const logout = async (c: Context, client: Client) => {
  const refreshToken = getRefreshTokenFromCookie(c);
  if (refreshToken) {
    const dbToken = await getRefreshTokenData(client, refreshToken);
    if (dbToken) {
      await deleteRefreshToken(client, refreshToken);
    }
  }
  revokeRefreshTokenCookie(c);
  return c.json({ message: "Logged out successfully" }, 200);
};

export const refreshToken = async (c: Context, client: Client) => {
  const refreshToken = getRefreshTokenFromCookie(c);
  if (!refreshToken) {
    return c.json({ error: "No refresh token provided" }, 401);
  }

  const dbToken = await getRefreshTokenData(client, refreshToken);
  if (!dbToken || new Date(dbToken.expires_at) < new Date()) {
    return c.json({ error: "Invalid or expired refresh token" }, 401);
  }

  const user = await fetchUserByEmail(client, dbToken.email);
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  await rotateRefreshToken(client, c, dbToken.token, user.id);

  const jwtToken = generateJwtToken(user.email);

  return c.json({ token: jwtToken }, 200);
};
