import { AuthenticationRepositoryInterface } from "#modules/authentication/domain/authenticationRepositoryInterface.ts";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "#common/errors/authenticationError.ts";
import { Context } from "@hono/hono";
import {
  generateJwtToken,
  generateSecureToken,
} from "../../../common/services/tokenService.ts";
import { getRefreshTokenDuration } from "../../../common/config/secret.ts";
import { compare as checkPassword } from "../../../common/services/hashService.ts";
import { createUserService } from "../../users/application/userService.ts";
import { createUserRepository } from "../../users/infrastructure/userRespository.ts";
import { getClient } from "../../../common/config/db.ts";

const client = await getClient();
const userService = createUserService(createUserRepository(client));

export const createAuthenticationService = (
  repo: AuthenticationRepositoryInterface,
) => {
  return {
    async login(context: Context, email: string, password: string) {
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
      const authRow = await repo.getAuthenticationRowByEmail(email);
      if (!authRow) {
        return {
          user: null,
          error: new AuthenticationError(
            "User not found",
            AuthenticationErrorCode.USER_NOT_FOUND,
          ).toJson(),
          status: 404,
        };
      }

      const isPasswordValid = checkPassword(
        password,
        authRow.password,
        authRow.salt,
      );
      if (!isPasswordValid) {
        return {
          user: null,
          error: new AuthenticationError(
            "Invalid password",
            AuthenticationErrorCode.INVALID_PASSWORD,
          ).toJson(),
          status: 401,
        };
      }

      const token = generateJwtToken(email);
      const refreshToken = generateSecureToken();
      const duration = getRefreshTokenDuration();
      const expiresAt = new Date(Date.now() + duration * 1000);

      // Fetch user ID using userService
      const fetchedUser = await userService.getUserByEmail(authRow.email);
      if (!fetchedUser || !fetchedUser.user) {
        throw new AuthenticationError(
          "User not found",
          AuthenticationErrorCode.USER_NOT_FOUND,
        );
      }
      const userId = fetchedUser.user.id;
      await repo.insertRefreshToken(userId, refreshToken, expiresAt);

      context.res.headers.append(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${Math.floor(
          (expiresAt.getTime() - Date.now()) / 1000,
        )}`,
      );

      return {
        user: fetchedUser.user, // Corrected to use `fetchedUser.user` instead of `authRow.user`
        token,
        error: null,
        status: 200,
      };
    },

    async rotateRefreshToken(
      context: Context,
      oldToken: string,
      userId: string,
    ) {
      await repo.deleteRefreshToken(oldToken);
      const refreshToken = generateSecureToken();
      const duration = getRefreshTokenDuration();
      const expiresAt = new Date(Date.now() + duration * 1000);

      await repo.insertRefreshToken(
        userId,
        refreshToken,
        expiresAt,
      );

      context.res.headers.append(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${Math.floor(
          (expiresAt.getTime() - Date.now()) / 1000,
        )}`,
      );
    },

    getRefreshTokenData(token: string) {
      return repo.getRefreshTokenByToken(token);
    },

    async deleteRefreshToken(token: string) {
      await repo.deleteRefreshToken(token);
    },

    revokeRefreshTokenCookie(c: Context) {
      c.res.headers.append(
        "Set-Cookie",
        "refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0",
      );
    },

    getRefreshTokenFromCookie(c: Context): string | undefined {
      const cookie = c.req.header("Cookie");
      return cookie?.match(/refreshToken=([^;]+)/)?.[1];
    },
  };
};
