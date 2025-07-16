import { Context } from "@hono/hono";
import { generateJwtToken } from "#common/services/tokenService.ts";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "#common/errors/authenticationError.ts";
import { ServerError } from "#common/errors/serverError.ts";
import { getAuthenticationService } from "#modules/authentication/dependencies.ts";
import { getUserService } from "#modules/users/dependencies.ts";

export function createAuthenticationController(
  authService: Awaited<ReturnType<typeof getAuthenticationService>>,
  userService: Awaited<ReturnType<typeof getUserService>>,
) {
  return {
    login: async (c: Context) => {
      const { email, password } = await c.req.json();
      return c.json(await authService.login(c, email, password));
    },

    logout: async (c: Context) => {
      const refreshToken = c.req.header("Authorization")?.replace(
        "Bearer ",
        "",
      );
      if (refreshToken) {
        const dbToken = await authService.getRefreshTokenData(refreshToken);
        if (dbToken) {
          await authService.deleteRefreshToken(refreshToken);
        }
      }
      authService.revokeRefreshTokenCookie(c);
      return c.json(
        { data: { message: "Logged out successfully" }, error: null },
        200,
      );
    },

    refreshToken: async (c: Context) => {
      const refreshToken = authService.getRefreshTokenFromCookie(c);
      if (!refreshToken) {
        return c.json({ error: "No refresh token provided" }, 401);
      }

      const dbToken = await authService.getRefreshTokenData(refreshToken);
      if (!dbToken || new Date(dbToken.expires_at) < new Date()) {
        return c.json({ error: "Invalid or expired refresh token" }, 401);
      }

      try {
        const fetchedUser = await userService.getUserByEmail(dbToken.email);
        const user = fetchedUser.user;
        if (!user) {
          throw new AuthenticationError(
            "User not found",
            AuthenticationErrorCode.USER_NOT_FOUND,
          );
        }
        await authService.rotateRefreshToken(c, dbToken.token, user.id);
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
    },
  };
}
