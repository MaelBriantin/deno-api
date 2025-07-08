export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class UserModel implements User {
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

  static fromRow(row: UserRow): UserModel {
    return new UserModel({
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
    });
  }
}

export default UserModel;
