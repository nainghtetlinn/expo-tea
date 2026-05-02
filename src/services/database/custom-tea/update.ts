import type { CustomTea } from "@/types/custom-tea";
import { db } from "../sqlite";

export const updateCustomTea = async (
  id: number,
  tea: Omit<CustomTea, "id" | "created_at">,
): Promise<boolean> => {
  try {
    await db.runAsync(
      "UPDATE custom_teas SET name = ?, description = ?, tea = ?, condensedMilk = ?, evaporatedMilk = ?, milk = ? WHERE id = ?",
      [
        tea.name,
        tea.description,
        tea.tea,
        tea.condensedMilk,
        tea.evaporatedMilk,
        tea.milk,
        id,
      ],
    );
    return true;
  } catch (error) {
    console.error("Error updating custom tea:", error);
    return false;
  }
};
