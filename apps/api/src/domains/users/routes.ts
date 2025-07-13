import { Hono } from "@hono/hono";
import * as userController from "./controller.ts";

export const createUserRoutes = () => {
  const users = new Hono();

  users.get("/", (context) => userController.getAllUsers(context));
  users.get("/:id", (context) => userController.getUserById(context));
  users.get("/:email/email", (context) => userController.getUserByEmail(context));
  users.post("/", (context) => userController.createUser(context));

  return users;
};
