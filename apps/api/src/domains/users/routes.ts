import { Hono } from "hono";
import { Client } from "mysql";
import * as userController from "./controller.ts";

export const createUserRoutes = (client: Client) => {
  const users = new Hono();

  users.get("/", (c) => userController.getAllUsers(c, client));
  users.get("/:id", (c) => userController.getUserById(c, client));
  users.get("/:email/email", (c) => userController.getUserByEmail(c, client));
  users.post("/", (c) => userController.createUser(c, client));

  return users;
};
