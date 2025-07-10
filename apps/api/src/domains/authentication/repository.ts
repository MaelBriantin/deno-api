import { Client } from "mysql";
import { AuthenticationRow } from "./model.ts";

interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

interface RefreshTokenRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date | string;
  created_at: Date | string;
  email: string;
}

export const getAuthenticationRowByEmail = async (
  client: Client,
  email: string,
): Promise<AuthenticationRow | null> => {
  const rows: AuthenticationRow[] = await client.query(
    "SELECT email, password FROM users WHERE email = ?",
    [email],
  );
  return rows[0] ?? null;
};

export const insertRefreshToken = async (
  client: Client,
  { userId, token, expiresAt }: RefreshToken,
): Promise<void> => {
  const id = crypto.randomUUID();
  await client.execute(
    `INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
    [id, userId, token, expiresAt],
  );
};

export const getRefreshTokenByToken = async (
  client: Client,
  token: string,
): Promise<RefreshTokenRow | null> => {
  const rows = await client.query(
    `SELECT rt.*, u.email FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ?`,
    [token],
  );
  return rows[0] ?? null;
};

export const deleteRefreshToken = async (
  client: Client,
  token: string,
): Promise<void> => {
  await client.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
};
