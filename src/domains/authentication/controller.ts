import { Context } from "hono";
import { Client } from "mysql";
import { getUserByEmail } from "./../users/repository.ts";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { verify } from "@bronti/argon2";

export const login = async (c: Context, client: Client) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  try {
    const authRow = await getAuthenticationRowByEmail(client, email);
    if (!authRow) {
      return c.json({ error: "User not found" }, 404);
    }
    const isPasswordValid = verify(password, authRow.password);
    if (!isPasswordValid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const user = await getUserByEmail(client, email);
    return c.json({ message: "Login successful", user }, 200);
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
};
