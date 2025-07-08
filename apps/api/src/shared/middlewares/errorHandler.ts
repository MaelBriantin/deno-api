import { Context } from "hono";

export const errorHandler = (err: Error, c: Context) => {
  const debug = Deno.env.get("DEBUG") === "true";
  console.error("Unhandled error:", err);
  return c.json(
    debug
      ? { error: err.message, stack: err.stack }
      : { error: err.message ?? "Internal Server Error" },
    500,
  );
};
