import User from "./userModel.ts";

export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class UserRow implements UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  constructor(data: Partial<UserRow>) {
    this.id = data.id ?? "";
    this.first_name = data.first_name ?? "";
    this.last_name = data.last_name ?? "";
    this.email = data.email ?? "";
    this.password = data.password ?? "";
  }

  static fromUser(user: User): UserRow {
    return new UserRow({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: "",
    });
  }
}