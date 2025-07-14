import { createDbClient } from "../../src/common/config/db.ts";
import { getMigrationsDir } from "./migration_utils.ts";

async function runMigrations() {
  const client = await createDbClient();

  // Create the migrations tracking table if it doesn't exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // List migration files
  const migrations: string[] = [];
  const migrationsDir = getMigrationsDir();
  for await (const entry of Deno.readDir(migrationsDir)) {
    if (entry.isFile && entry.name.endsWith(".sql")) {
      migrations.push(entry.name);
    }
  }
  migrations.sort();

  // Retrieve already applied migrations
  const appliedRows = await client.query("SELECT name FROM migrations");
  const applied = new Set(
    appliedRows.map((r: Record<string, unknown>) => r.name as string),
  );

  // If a specific migration is provided, apply it
  const migrationArg = Deno.args[0];
  if (migrationArg) {
    if (!migrations.includes(migrationArg)) {
      console.error(`Migration file not found: ${migrationArg}`);
      await client.close();
      Deno.exit(1);
    }
    if (applied.has(migrationArg)) {
      console.log(`Migration already applied: ${migrationArg}`);
      await client.close();
      return;
    }
    const sql = await Deno.readTextFile(`${migrationsDir}/${migrationArg}`);
    const upMatch = sql.match(/-- up([\s\S]*?)(-- down|$)/i);
    if (!upMatch) {
      console.error(`No -- up block found in ${migrationArg}`);
      await client.close();
      Deno.exit(1);
    }
    const upSql = upMatch[1].trim();
    if (!upSql) {
      console.error(`Empty -- up block in ${migrationArg}`);
      await client.close();
      Deno.exit(1);
    }
    console.log(`Applying migration: ${migrationArg}`);
    await client.execute(upSql);
    await client.execute("INSERT INTO migrations(name) VALUES(?)", [
      migrationArg,
    ]);
  } else {
    for (const migration of migrations) {
      if (!applied.has(migration)) {
        const sql = await Deno.readTextFile(`${migrationsDir}/${migration}`);
        // Extract the -- up block
        const upMatch = sql.match(/-- up([\s\S]*?)(-- down|$)/i);
        if (!upMatch) {
          console.error(`No -- up block found in ${migration}`);
          continue;
        }
        const upSql = upMatch[1].trim();
        if (!upSql) {
          console.error(`Empty -- up block in ${migration}`);
          continue;
        }
        console.log(`Applying migration: ${migration}`);
        await client.execute(upSql);
        await client.execute("INSERT INTO migrations(name) VALUES(?)", [
          migration,
        ]);
      }
    }
  }
  await client.close();
  console.log("All migrations applied.");
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  Deno.exit(1);
});
