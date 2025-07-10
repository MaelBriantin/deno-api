import { Hono } from "@hono/hono";
import { Client } from "mysql";
import * as authController from "./controller.ts";

export const createAuthRoutes = (client: Client) => {
  const auth = new Hono();

  auth.post("/login", (c) => authController.login(c, client));
  auth.post("/logout", (c) => authController.logout(c, client));
  auth.post("/refresh-token", (c) => authController.refreshToken(c, client));

  return auth;
};
