import { archetypes } from "./routes/index.ts";
import { Hono } from "@hono/hono";
export const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, 🦕" });
});

app.route("/archetypes", archetypes);

Deno.serve({ 
  port: Number(Deno.env.get("PORT")),
  hostname: Deno.env.get("HOSTNAME"),
}, app.fetch);
