

import { Client } from "mysql";
import { User } from "../domain/userModel.ts";
import { UserRow } from "../domain/userRow.ts";
import { UserRepositoryInterface } from "../domain/userRepositoryInterface.ts";

export function createUserRepository(client: Client): UserRepositoryInterface {
  return {
    async getAll(): Promise<User[]> {
      const rows: UserRow[] = await client.query("SELECT * FROM users");
      return rows.map((row) => User.fromRow(row));
    },
    async getById(id: string): Promise<User | null> {
      const rows: UserRow[] = await client.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
      );
      const row = rows[0];
      return row ? User.fromRow(row) : null;
    },
    async getByEmail(email: string): Promise<User | null> {
      const rows: UserRow[] = await client.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      const row = rows[0];
      return row ? User.fromRow(row) : null;
    },
    async insert(user: User, password: string, salt: string): Promise<User> {
      await client.execute(
        "INSERT INTO users(id, first_name, last_name, email, password, salt) VALUES(?, ?, ?, ?, ?, ?)",
        [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          password,
          salt,
        ],
      );
      return user;
    },
  };
}
