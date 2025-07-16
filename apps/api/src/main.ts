import { Hono } from "@hono/hono";
// import { jwt } from "@hono/hono/jwt";
import { createUserRoutes } from "#modules/users/api/userRoutes.ts";
import { createAuthRoutes } from "#modules/authentication/api/authenticationRoutes.ts";
import { errorHandler } from "#common/middlewares/errorHandler.ts";
import schema from "#common/graphql/schema.ts";
// import { getSecretKey } from "./common/config/secret.ts";

// const secret = getSecretKey();

const app = new Hono();

app.onError(errorHandler);

app.route("/auth", await createAuthRoutes());

// app.use("/*", jwt({ secret }));

app.all("/graphql", async (c) => {
  const response = await schema.handle(c.req.raw);
  return response;
});

app.route("/users", await createUserRoutes());

Deno.serve(app.fetch);
