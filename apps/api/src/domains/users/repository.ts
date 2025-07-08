import { Client } from "mysql";
import { User, UserModel, UserRow } from "./model.ts";
import { hash as hashPassword } from "../../shared/services/hashService.ts";

export const getAllUsers = async (client: Client): Promise<User[]> => {
  const rows: UserRow[] = await client.query("SELECT * FROM users");
  return rows.map((row) => UserModel.fromRow(row));
};

export const getUserById = async (
  client: Client,
  id: string,
): Promise<User | null> => {
  const rows: UserRow[] = await client.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );
  const row = rows[0];
  return row ? UserModel.fromRow(row) : null;
};

export const getUserByEmail = async (
  client: Client,
  email: string,
): Promise<User | null> => {
  const rows: UserRow[] = await client.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return UserModel.fromRow(rows[0]) ?? null;
};

export const insertUser = async (
  client: Client,
  user: User,
  password: string,
) => {
  const hashedPassword = hashPassword(password);
  await client.execute(
    "INSERT INTO users(id, first_name, last_name, email, password) VALUES(?, ?, ?, ?, ?)",
    [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      hashedPassword,
    ],
  );
};
