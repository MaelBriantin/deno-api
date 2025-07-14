import { Hono } from "@hono/hono";
import { getUserController } from "../dependencies.ts";

export const createUserRoutes = async () => {
  const users = new Hono();
  const userController = await getUserController();

  users.get("/", userController.getAllUsers);
  users.get("/:id", userController.getUserById);
  users.get("/email/:email", userController.getUserByEmail);
  users.post("/", userController.createUser);

  return users;
};
