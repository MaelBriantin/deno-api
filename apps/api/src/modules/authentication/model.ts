interface Authentication {
  email: string;
  password: string;
}

export interface AuthenticationRow {
  email: string;
  password: string;
  salt: string;
}

export class AuthenticationModel implements Authentication {
  email: string;
  password: string;

  constructor(data: Partial<Authentication>) {
    this.email = data.email ?? "";
    this.password = data.password ?? "";
  }

  static fromRow(row: AuthenticationRow): AuthenticationModel {
    return new AuthenticationModel({
      email: row.email as string,
      password: row.password as string,
    });
  }
}
