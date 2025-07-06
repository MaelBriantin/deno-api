import { Hono } from "hono";
import { createDbClient } from "./shared/config/db.ts";
import { createUserRoutes } from "./domains/users/routes.ts";
import { createAuthRoutes } from "./domains/authentication/routes.ts";
import { errorHandler } from "./shared/middlewares/errorHandler.ts";

const client = await createDbClient();
const app = new Hono();

app.onError(errorHandler);

app.route("/users", createUserRoutes(client));
app.route("/auth", createAuthRoutes(client));

Deno.serve(app.fetch);
