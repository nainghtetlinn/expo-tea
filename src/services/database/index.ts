import { db } from "./sqlite";

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS custom_teas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        tea INTEGER NOT NULL,
        condensedMilk INTEGER NOT NULL,
        evaporatedMilk INTEGER NOT NULL,
        milk INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const tableInfo = await db.getAllAsync<{
      name: string;
      notnull: number;
    }>("PRAGMA table_info(custom_teas);");
    const descriptionColumn = tableInfo.find(
      (column) => column.name === "description",
    );

    if (descriptionColumn?.notnull === 1) {
      await db.execAsync(`
        CREATE TABLE custom_teas_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          tea INTEGER NOT NULL,
          condensedMilk INTEGER NOT NULL,
          evaporatedMilk INTEGER NOT NULL,
          milk INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO custom_teas_new (id, name, description, tea, condensedMilk, evaporatedMilk, milk, created_at)
        SELECT id, name, description, tea, condensedMilk, evaporatedMilk, milk, created_at
        FROM custom_teas;

        DROP TABLE custom_teas;
        ALTER TABLE custom_teas_new RENAME TO custom_teas;
      `);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export * from "./custom-tea/add";
export * from "./custom-tea/delete";
export * from "./custom-tea/get";
export * from "./custom-tea/update";
