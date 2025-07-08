import { Context } from "@hono/hono";
import { Client } from "mysql";

export const withDbError = (
  handler: (c: Context, client: Client) => Promise<Response>,
  dbErrorMsg = "Database error",
) => {
  return async (c: Context, client: Client) => {
    try {
      return await handler(c, client);
    } catch (error) {
      console.error("DB error:", error);
      return c.json({ error: dbErrorMsg }, 500);
    }
  };
};
