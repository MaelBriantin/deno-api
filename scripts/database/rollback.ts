import { createDbClient } from "../../src/shared/config/db.ts";

const rollbackMigration = async () => {
  const client = await createDbClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  let migrationName = Deno.args[0];
  if (!migrationName) {
    // Get the last applied migration
    const [last] = await client.query(
      "SELECT name FROM migrations ORDER BY id DESC LIMIT 1",
    );
    if (!last) {
      console.log("No migration to rollback.");
      await client.close();
      return;
    }
    migrationName = last.name as string;
  }

  // Check if the migration exists in the migrations table
  const [row] = await client.query(
    "SELECT name FROM migrations WHERE name = ?",
    [migrationName],
  );
  if (!row) {
    console.error(
      `Migration ${migrationName} is not applied or does not exist in migrations table.`,
    );
    await client.close();
    Deno.exit(1);
  }

  const sql = await Deno.readTextFile(`./migrations/${migrationName}`);
  // Extract the -- down block
  const downMatch = sql.match(/-- down([\s\S]*)/i);
  if (!downMatch) {
    console.error(`No -- down block found in ${migrationName}`);
    await client.close();
    Deno.exit(1);
  }
  const downSql = downMatch[1].trim();
  if (!downSql) {
    console.error(`Empty -- down block in ${migrationName}`);
    await client.close();
    Deno.exit(1);
  }
  console.log(`Rolling back migration: ${migrationName}`);
  await client.execute(downSql);
  await client.execute("DELETE FROM migrations WHERE name = ?", [
    migrationName,
  ]);
  await client.close();
  console.log("Rollback complete.");
};

rollbackMigration().catch((err) => {
  console.error("Rollback failed:", err);
  Deno.exit(1);
});
