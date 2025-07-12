import { Context } from "@hono/hono";
import {
  createUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
} from "./services.ts";

export const getAllUsers = async (c: Context) => {
  const usersResponse = await getAllUsersService();
  return c.json(usersResponse, 200);
};

export const getUserById = async (c: Context) => {
  const userId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const userResponse = await getUserByIdService(userId);
  return c.json(userResponse, 200);
};

export const getUserByEmail = async (c: Context) => {
  const email = c.req.param("email");
  if (!email) {
    return c.json({ error: "Invalid email" }, 400);
  }
  const userResponse = await getUserByEmailService(email);
  return c.json(userResponse, 200);
};

export const createUser = async (c: Context) => {
  const { firstName, lastName, email, password } = await c.req.json();
  const userResponse = await createUserService({
    firstName,
    lastName,
    email,
    password,
  });
  return c.json(userResponse, 201);
};
