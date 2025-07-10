import { Hono } from "@hono/hono";
import { jwt } from "@hono/hono/jwt";
import { createDbClient } from "./shared/config/db.ts";
import { createUserRoutes } from "./domains/users/routes.ts";
import { createAuthRoutes } from "./domains/authentication/routes.ts";
import { errorHandler } from "./shared/middlewares/errorHandler.ts";
import { getSecretKey } from "./shared/config/secret.ts";

const secret = getSecretKey();

const client = await createDbClient();
const app = new Hono();

app.onError(errorHandler);

app.route("/auth", createAuthRoutes(client));

app.use("/*", jwt({ secret }));
app.route("/users", createUserRoutes(client));

Deno.serve(app.fetch);
