import { Hono } from "@hono/hono";
import * as authController from "./controller.ts";

export const createAuthRoutes = () => {
  const auth = new Hono();

  auth.post("/login", (context) => authController.login(context));
  auth.post("/logout", (context) => authController.logout(context));
  auth.post("/refresh-token", (context) => authController.refreshToken(context));

  return auth;
};
