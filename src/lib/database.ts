import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("tea_recipes.db");

export interface CustomTea {
  id: number;
  name: string;
  description: string;
  tea: number;
  condensedMilk: number;
  evaporatedMilk: number;
  milk: number;
  created_at: string;
}

const dropTable = async () => {
  try {
    await db.execAsync(`
        DROP TABLE IF EXISTS custom_recipes;`);
  } catch (error) {
    console.error("Error dropping table:", error);
  }
};

export const initDatabase = async () => {
  try {
    // await dropTable();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS custom_recipes (
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

export const getCustomRecipes = async (): Promise<CustomTea[]> => {
  try {
    return await db.getAllAsync<CustomTea>(
      "SELECT * FROM custom_recipes ORDER BY created_at DESC",
    );
  } catch (error) {
    console.error("Error getting custom recipes:", error);
    return [];
  }
};

export const addCustomRecipe = async (
  recipe: Omit<CustomTea, "id" | "created_at">,
): Promise<number | null> => {
  try {
    const result = await db.runAsync(
      "INSERT INTO custom_recipes (name, description, tea, condensedMilk, evaporatedMilk, milk) VALUES (?, ?, ?, ?, ?, ?)",
      [
        recipe.name,
        recipe.description,
        recipe.tea,
        recipe.condensedMilk,
        recipe.evaporatedMilk,
        recipe.milk,
      ],
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding custom recipe:", error);
    return null;
  }
};

export const deleteCustomRecipe = async (id: number): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM custom_recipes WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting custom recipe:", error);
    return false;
  }
};

export const updateCustomRecipe = async (
  id: number,
  recipe: Omit<CustomTea, "id" | "created_at">,
): Promise<boolean> => {
  try {
    await db.runAsync(
      "UPDATE custom_recipes SET name = ?, description = ?, tea = ?, condensedMilk = ?, evaporatedMilk = ?, milk = ? WHERE id = ?",
      [
        recipe.name,
        recipe.description,
        recipe.tea,
        recipe.condensedMilk,
        recipe.evaporatedMilk,
        recipe.milk,
        id,
      ],
    );
    return true;
  } catch (error) {
    console.error("Error updating custom recipe:", error);
    return false;
  }
};
