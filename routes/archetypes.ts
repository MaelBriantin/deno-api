import { Hono } from "@hono/hono";

export const archetypes = new Hono();

export const list = [
  {
    id: 1,
    name: "Warrior",
    description: "A strong fighter with a sword and shield.",
  },
  {
    id: 2,
    name: "Mage",
    description: "A powerful spellcaster with a staff.",
  },
  {
    id: 3,
    name: "Rogue",
    description: "A sneaky thief with a dagger.",
  },
];

archetypes.get("/", (c) => {
  return c.json({ message: list });
});