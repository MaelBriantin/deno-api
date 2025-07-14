
import { createDbClient } from "../../src/common/config/db.ts";
import { getUserService } from "../../src/modules/users/dependencies.ts";

const run = async () => {
  const client = await createDbClient();
  const userService = await getUserService();

  await userService.createUser({
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "password123",
  });

  await userService.createUser({
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
