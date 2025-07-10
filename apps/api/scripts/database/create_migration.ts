import { getMigrationFilePath } from "./migration_utils.ts";

const main = async () => {
  const table = Deno.args[0];
  if (!table) {
    console.error(
      "Usage: deno run --allow-read --allow-write scripts/create_migration.ts <table_name>",
    );
    Deno.exit(1);
  }
  const path = getMigrationFilePath(table, "create");
  const content = `-- Migration: create table ${table}

-- up
CREATE TABLE IF NOT EXISTS ${table} (
  id CHAR(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  -- add your columns here
);

-- down
DROP TABLE IF EXISTS ${table};
`;
  await Deno.writeTextFile(path, content);
  console.log(`Created migration: ${path}`);
};

main();
