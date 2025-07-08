import { Client } from "mysql";
import { AuthenticationRow } from "./model.ts";

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
