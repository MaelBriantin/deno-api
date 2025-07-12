import { Context } from "@hono/hono";
import { Client } from "mysql";
import {
  createUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
} from "./services.ts";

export const getAllUsers = async (c: Context, client: Client) => {
  const usersResponse = await getAllUsersService(client);
  return c.json(usersResponse, 200);
};

export const getUserById = async (c: Context, client: Client) => {
  const userId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const userResponse = await getUserByIdService(client, userId);
  return c.json(userResponse, 200);
};

export const getUserByEmail = async (c: Context, client: Client) => {
  const email = c.req.param("email");
  if (!email) {
    return c.json({ error: "Invalid email" }, 400);
  }
  const userResponse = await getUserByEmailService(client, email);
  return c.json(userResponse, 200);
};

export const createUser = async (c: Context, client: Client) => {
  const { firstName, lastName, email, password } = await c.req.json();
  const userResponse = await createUserService(client, {
    firstName,
    lastName,
    email,
    password,
  });
  return c.json(userResponse, 201);
};
