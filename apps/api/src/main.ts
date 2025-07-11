import { Hono } from "@hono/hono";
import { jwt } from "@hono/hono/jwt";
import { createDbClient } from "./shared/config/db.ts";
import { createUserRoutes } from "./domains/users/routes.ts";
import { createAuthRoutes } from "./domains/authentication/routes.ts";
import { errorHandler } from "./shared/middlewares/errorHandler.ts";
import { getSecretKey } from "./shared/config/secret.ts";
import { yoga } from "./shared/graphql/yoga.ts";

const secret = getSecretKey();

const client = await createDbClient();
const app = new Hono();
const graphqlContext = { client };

app.onError(errorHandler);

app.route("/auth", createAuthRoutes(client));

app.all("/graphql", async (c) => {
  const response = await yoga.handle(c.req.raw, graphqlContext);
  return response;
});

// app.use("/*", jwt({ secret }));
app.route("/users", createUserRoutes(client));

Deno.serve(app.fetch);
