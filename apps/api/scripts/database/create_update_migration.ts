import { getMigrationFilePath } from "./migration_utils.ts";

if (import.meta.main) {
  const [desc] = Deno.args;
  if (!desc) {
    console.error("Usage: deno run --allow-read --allow-write --allow-env ./scripts/database/create_update_migration.ts <description>");
    Deno.exit(1);
  }
  const filePath = getMigrationFilePath(desc, "update");
  const tableName = desc.match(/^(\w+)/)?.[1] ?? desc;
  const content = `-- Migration: update ${tableName}
-- up
ALTER TABLE ${tableName};

-- down
ALTER TABLE ${tableName};
`;
  await Deno.writeTextFile(filePath, content);
  console.log(`Created migration: ${filePath}`);
}
