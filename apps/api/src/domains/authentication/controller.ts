import { Context } from "@hono/hono";
import { Client } from "mysql";
import {
  fetchUserByEmail,
  generateJwtToken,
  validateUserCredentials,
} from "./service.ts";
import jwt from "jsonwebtoken";
import { getSecretKey } from "../../shared/config/secret.ts";

const SECRET_KEY = getSecretKey();

export const login = async (c: Context, client: Client) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  try {
    await validateUserCredentials(client, email, password);

    const jwtToken = generateJwtToken(email);
    const user = await fetchUserByEmail(client, email);
    return c.json({ message: "Login successful", user, token: jwtToken }, 200);
  } catch (error) {
    const errorMessage = (error instanceof Error)
      ? error.message
      : String(error);
    return c.json({ error: errorMessage }, 401);
  }
};
