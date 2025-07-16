import { AuthenticationRow } from "./authenticationModel.ts";

export interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date | string;
  created_at: Date | string;
  email: string;
}

export interface AuthenticationRepositoryInterface {
  getAuthenticationRowByEmail(email: string): Promise<AuthenticationRow | null>;
  insertRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;
  getRefreshTokenByToken(token: string): Promise<RefreshTokenRow | null>;
  deleteRefreshToken(token: string): Promise<void>;
}
