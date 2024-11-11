import { Database } from "@db/sqlite";

const db = new Database(`./database/${Deno.env.get("DB_NAME")}.sqlite`);

db.close();
