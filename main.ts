import { Hono } from "@hono/hono";
import { archetypes } from "@routes";

export const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, 🦕" });
});

app.route("/archetypes", archetypes);

Deno.serve(app.fetch);
