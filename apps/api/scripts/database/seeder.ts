import { createDbClient } from "../../src/shared/config/db.ts";
import { insertUser } from "../../src/domains/users/repository.ts";

const run = async () => {
  const client = await createDbClient();

  await insertUser(client, {
    id: crypto.randomUUID(),
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
  }, "password123");

  await insertUser(client, {
    id: crypto.randomUUID(),
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
  }, "password456");

  await client.close();
  console.log("Database seeded successfully.");
};

run().catch((err) => {
  console.error("Seeding error:", err);
  Deno.exit(1);
});
