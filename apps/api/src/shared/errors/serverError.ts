export enum ServerErrorCode {
  SERVER_ERROR = "SERVER_ERROR",
}

export class ServerError extends Error {
  code: ServerErrorCode;
  constructor(
    message: string = "Internal Server Error",
    code: ServerErrorCode = ServerErrorCode.SERVER_ERROR,
  ) {
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
