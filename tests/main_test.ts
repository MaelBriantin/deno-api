import { assertEquals } from "@std/assert";
import { list } from "@routes";

export const baseUrl = Deno.env.get("BASE_URL") as string;

Deno.test("GET /", async () => {
  const response = await fetch(baseUrl);
  const body = await response.json();
  assertEquals(body, { message: "Hello, 🦕" });
});

Deno.test("GET /archetypes", async () => {
  const response = await fetch(`${baseUrl}/archetypes`);
  const body = await response.json();
  assertEquals(body, { message: list });
});
