import { Context } from "@hono/hono";
import { Client } from "mysql";
import {
  fetchUserByEmail,
  generateCsrfToken,
  generateJwtToken,
  isValidCsrfToken,
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

    const token = generateJwtToken(email);
    const csrfToken = generateCsrfToken();

    c.res.headers.append(
      "Set-Cookie",
      `JWT-TOKEN=${token}; HttpOnly; Secure; Path=/; Max-Age=3600`,
    );
    c.res.headers.append(
      "Set-Cookie",
      `CSRF-TOKEN=${csrfToken}; HttpOnly; Secure; Path=/`,
    );

    const user = await fetchUserByEmail(client, email);
    return c.json({ message: "Login successful", user }, 200);
  } catch (error) {
    const errorMessage = (error instanceof Error)
      ? error.message
      : String(error);
    return c.json({ error: errorMessage }, 401);
  }
};

export const logout = (c: Context) => {
  const csrfToken = c.req.header("X-CSRF-Token");
  const cookieToken = c.req.header("Cookie")?.match(/CSRF-TOKEN=([^;]+)/)?.[1];

  if (!isValidCsrfToken(csrfToken, cookieToken)) {
    return c.json({ error: "Invalid CSRF token" }, 403);
  }

  c.res.headers.append(
    "Set-Cookie",
    "JWT-TOKEN=; HttpOnly; Secure; Path=/; Max-Age=0",
  );
  return c.json({ message: "Logout successful" }, 200);
};

export const verifyToken = async (c: Context, client: Client) => {
  const token = c.req.header("Cookie")?.match(/JWT-TOKEN=([^;]+)/)?.[1];

  if (!token) {
    return c.json({ error: "Unauthorized: No token provided" }, 401);
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
    c.set("user", decoded);

    const user = await fetchUserByEmail(client, decoded.email);
    return c.json({ message: "Token is valid", user }, 200);
  } catch (_error) {
    return c.json({ error: "Unauthorized: Invalid token" }, 401);
  }
};
