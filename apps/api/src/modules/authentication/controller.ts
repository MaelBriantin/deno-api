import { Context } from "@hono/hono";
import {
deleteRefreshTokenService,
  fetchUserByEmail,
  getRefreshTokenData,
  getRefreshTokenFromCookie,
  loginService,
  revokeRefreshTokenCookie,
  rotateRefreshToken,
} from "./services.ts";
import { generateJwtToken } from "../../common/services/tokenService.ts";
import { AuthenticationError, AuthenticationErrorCode } from "./error.ts";
import { ServerError } from "../../common/errors/serverError.ts";

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();
  return c.json(await loginService(c, email, password));
};

export const logout = async (c: Context) => {
  const refreshToken = getRefreshTokenFromCookie(c);
  if (refreshToken) {
    const dbToken = await getRefreshTokenData(refreshToken);
    if (dbToken) {
      await deleteRefreshTokenService(refreshToken);
    }
  }
  revokeRefreshTokenCookie(c);
  return c.json(
    { data: { message: "Logged out successfully" }, error: null },
    200,
  );
};

export const refreshToken = async (c: Context) => {
  const refreshToken = getRefreshTokenFromCookie(c);
  if (!refreshToken) {
    return c.json({ error: "No refresh token provided" }, 401);
  }

  const dbToken = await getRefreshTokenData(refreshToken);
  if (!dbToken || new Date(dbToken.expires_at) < new Date()) {
    return c.json({ error: "Invalid or expired refresh token" }, 401);
  }

  try {
    const fetchedUser = await fetchUserByEmail(dbToken.email);
    const user = fetchedUser.user;
    if (!user) {
      throw new AuthenticationError(
        "User not found",
        AuthenticationErrorCode.USER_NOT_FOUND,
      );
    }
    await rotateRefreshToken(c, dbToken.token, user.id);
    const jwtToken = generateJwtToken(user.email);
    return c.json({ data: null, token: jwtToken, error: null }, 200);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return c.json({ data: null, error: error.toJson() }, 401);
    }
    return c.json(
      { data: null, error: new ServerError().toJson() },
      500,
    );
  }
};
