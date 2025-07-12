import { Client } from "mysql";

export const createDbClient = async () => {
  const client = await new Client().connect({
    hostname: Deno.env.get("DB_HOST"),
    username: Deno.env.get("DB_USER"),
    db: Deno.env.get("DB_NAME"),
    password: Deno.env.get("DB_PASS"),
  });
  return client;
};

export const getClient = async () => {
  return await createDbClient();
};
