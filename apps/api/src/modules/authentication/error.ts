export enum AuthenticationErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
  INVALID_TOKEN = "INVALID_TOKEN",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",
}

export class AuthenticationError extends Error {
  code: AuthenticationErrorCode;
  constructor(message: string, code: AuthenticationErrorCode) {
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
