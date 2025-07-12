export enum UserErrorCode {
  EMAIL_CONFLICT = "EMAIL_CONFLICT",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_FIRST_NAME = "INVALID_FIRST_NAME",
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_LAST_NAME = "INVALID_LAST_NAME",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USERS_NOT_FOUND = "USERS_NOT_FOUND",
}

export class UserError extends Error {
  code: UserErrorCode;
  constructor(message: string, code: UserErrorCode) {
    super(message);
    this.code = code;
  }

  toJson() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}
