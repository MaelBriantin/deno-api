import { Context } from "@hono/hono";
import { createUserService } from "../application/userService.ts";

export function createUserController(userService: ReturnType<typeof createUserService>) {
  return {
    getAllUsers: async (c: Context) => {
      const usersResponse = await userService.getAllUsers();
      return c.json(usersResponse, 200);
    },
    getUserById: async (c: Context) => {
      const userId = c.req.param("id");
      if (!userId) {
        return c.json({ error: "Invalid user ID" }, 400);
      }
      const userResponse = await userService.getUserById(userId);
      return c.json(userResponse, 200);
    },
    getUserByEmail: async (c: Context) => {
      const email = c.req.param("email");
      if (!email) {
        return c.json({ error: "Invalid email" }, 400);
      }
      const userResponse = await userService.getUserByEmail(email);
      return c.json(userResponse, 200);
    },
    createUser: async (c: Context) => {
      const { firstName, lastName, email, password } = await c.req.json();
      const userResponse = await userService.createUser({
        firstName,
        lastName,
        email,
        password,
      });
      return c.json(userResponse, 201);
    },
  };
}
