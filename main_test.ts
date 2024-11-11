import { assertEquals } from "@std/assert";
import { list } from "@routes";

Deno.test("GET /", async () => {
  const response = await fetch("http://localhost:8000/");
  const body = await response.json();
  assertEquals(body, { message: "Hello, 🦕" });
});

Deno.test("GET /archetypes", async () => {
  const response = await fetch("http://localhost:8000/archetypes");
  const body = await response.json();
  assertEquals(body, { message: list });
});
