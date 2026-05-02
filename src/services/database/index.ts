import { db } from "./sqlite";

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS custom_teas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        tea INTEGER NOT NULL,
        condensedMilk INTEGER NOT NULL,
        evaporatedMilk INTEGER NOT NULL,
        milk INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export * from "./custom-tea/add";
export * from "./custom-tea/delete";
export * from "./custom-tea/get";
export * from "./custom-tea/update";
