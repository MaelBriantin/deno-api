import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, 🦕" });
});

Deno.serve(app.fetch);
