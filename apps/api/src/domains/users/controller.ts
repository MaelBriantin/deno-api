import { Context } from "@hono/hono";
import { Client } from "mysql";
import * as repo from "./repository.ts";

export const getAllUsers = async (c: Context, client: Client) => {
  const users = await repo.getAllUsers(client);
  if (!users || users.length === 0) {
    return c.json({ message: "No users found" }, 404);
  }
  return c.json(users);
};

export const getUserById = async (c: Context, client: Client) => {
  const userId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const user = await repo.getUserById(client, userId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json(user);
};

export const getUserByEmail = async (c: Context, client: Client) => {
  const email = c.req.param("email");
  if (!email) {
    return c.json({ error: "Invalid email" }, 400);
  }
  const user = await repo.getUserByEmail(client, email);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json(user);
};

export const createUser = async (c: Context, client: Client) => {
  const { firstName, lastName, email, password } = await c.req.json();
  if (!firstName || typeof firstName !== "string") {
    return c.json({ error: "Invalid user first name" }, 400);
  }
  if (!lastName || typeof lastName !== "string") {
    return c.json({ error: "Invalid user last name" }, 400);
  }
  if (!email || typeof email !== "string") {
    return c.json({ error: "Invalid user email" }, 400);
  }
  if (!password || typeof password !== "string") {
    return c.json({ error: "Invalid user password" }, 400);
  }
  const id = crypto.randomUUID();
  await repo.insertUser(client, { id, firstName, lastName, email }, password);
  return c.json("User created", 201);
};
