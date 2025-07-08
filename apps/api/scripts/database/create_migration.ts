const migrationsDir = "./migrations";

const getTimestamp = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}${MM}${dd}_${hh}${mm}${ss}`;
};

const main = async () => {
  const table = Deno.args[0];
  if (!table) {
    console.error(
      "Usage: deno run --allow-read --allow-write scripts/create_migration.ts <table_name>",
    );
    Deno.exit(1);
  }
  await Deno.mkdir(migrationsDir, { recursive: true });
  const timestamp = getTimestamp();
  const filename = `${timestamp}_create_${table}.sql`;
  const path = `${migrationsDir}/${filename}`;
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
