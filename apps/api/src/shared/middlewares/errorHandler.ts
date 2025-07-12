import { Context } from "@hono/hono";
import {
  AuthenticationError,
  AuthenticationErrorCode,
} from "../../domains/authentication/error.ts";

export const errorHandler = (err: Error, c: Context) => {
  const debug = Deno.env.get("DEBUG") === "true";
  console.error("Unhandled error:", err);
  interface StatusError extends Error {
    status?: number;
  }
  const hasStatus = (error: Error): error is StatusError =>
    typeof (error as StatusError).status === "number";
  if (hasStatus(err) && err.status === 401) {
    return c.json({
      error: new AuthenticationError(
        "Invalid or expired token",
        AuthenticationErrorCode.INVALID_TOKEN,
      ).toJson(),
    }, 401);
  }
  return c.json(
    debug
      ? { error: err.message, stack: err.stack }
      : { error: err.message ?? "Internal Server Error" },
    500,
  );
};
