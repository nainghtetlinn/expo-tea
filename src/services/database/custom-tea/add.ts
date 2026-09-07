import type { CustomTea } from "@/types/custom-tea";
import { db } from "../sqlite";

export const addCustomTea = async (
  tea: Omit<CustomTea, "id" | "created_at">,
): Promise<number | null> => {
  try {
    const description = tea.description.trim() || null;
    const result = await db.runAsync(
      "INSERT INTO custom_teas (name, description, tea, condensedMilk, evaporatedMilk, milk) VALUES (?, ?, ?, ?, ?, ?)",
      [
        tea.name,
        description,
        tea.tea,
        tea.condensedMilk,
        tea.evaporatedMilk,
        tea.milk,
      ],
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding custom tea:", error);
    return null;
  }
};
