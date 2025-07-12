import { createDbClient } from "../../src/shared/config/db.ts";
import { createUserService } from "../../src/domains/users/services.ts";

const run = async () => {
  const client = await createDbClient();

  await createUserService({
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "password123",
  });

  await createUserService({
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    password: "password123",
  });

  await client.close();
  console.log("Database seeded successfully.");
};

run().catch((err) => {
  console.error("Seeding error:", err);
  Deno.exit(1);
});
