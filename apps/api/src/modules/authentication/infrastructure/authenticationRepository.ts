import { Client } from "mysql";
import { AuthenticationRow } from "#modules/authentication/domain/authenticationModel.ts";
import {
  AuthenticationRepositoryInterface,
  RefreshTokenRow,
} from "#modules/authentication/domain/authenticationRepositoryInterface.ts";

export function createAuthenticationRepository(
  client: Client,
): AuthenticationRepositoryInterface {
  return {
    async getAuthenticationRowByEmail(
      email: string,
    ): Promise<AuthenticationRow | null> {
      const rows: AuthenticationRow[] = await client.query(
        "SELECT email, password, salt FROM users WHERE email = ?",
        [email],
      );
      return rows[0] ?? null;
    },
    async insertRefreshToken(
      userId,
      token,
      expiresAt,
    ): Promise<void> {
      const id = crypto.randomUUID();
      await client.execute(
        `INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
        [id, userId, token, expiresAt],
      );
    },
    async getRefreshTokenByToken(
      token: string,
    ): Promise<RefreshTokenRow | null> {
      const rows = await client.query(
        `SELECT rt.*, u.email FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ?`,
        [token],
      );
      return rows[0] ?? null;
    },
    async deleteRefreshToken(token: string): Promise<void> {
      await client.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [
        token,
      ]);
    },
  };
}
