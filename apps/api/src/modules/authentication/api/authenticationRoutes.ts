import { Hono } from "@hono/hono";
import { getAuthenticationController } from "#modules/authentication/dependencies.ts";

export const createAuthRoutes = async () => {
  const auth = new Hono();

  const authController = await getAuthenticationController();

  auth.post("/login", (context) => authController.login(context));
  auth.post("/logout", (context) => authController.logout(context));
  auth.post(
    "/refresh-token",
    (context) => authController.refreshToken(context),
  );

  return auth;
};
