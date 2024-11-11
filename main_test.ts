import { assertEquals } from "@std/assert";

Deno.test("GET /", async () => {
  const response = await fetch("http://localhost:8000/");
  const body = await response.json();
  assertEquals(body, { message: "Hello, 🦕" });
});
  