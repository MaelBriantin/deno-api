import { UserRow } from "./userRow.ts";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class User implements User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: Partial<User>) {
    this.id = data.id ?? crypto.randomUUID();
    this.firstName = data.firstName ?? "";
    this.lastName = data.lastName ?? "";
    this.email = data.email ?? "";
  }

  static fromRow(row: UserRow): User {
    return new User({
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
    });
  }
}

export default User;
