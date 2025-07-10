import { join } from "@std/path";

export function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
}

export function getMigrationFilename(description: string, type: "create" | "update" = "update") {
  const timestamp = getTimestamp();
  const safeDesc = description.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  return `${timestamp}_${type}_${safeDesc}.sql`;
}

export function getMigrationsDir() {
  return "./migrations";
}

export function getMigrationFilePath(description: string, type: "create" | "update" = "update") {
  const migrationsDir = getMigrationsDir();
  const filename = getMigrationFilename(description, type);
  return join(migrationsDir, filename);
}
