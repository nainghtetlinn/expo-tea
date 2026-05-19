import type { CustomTea } from "@/types/custom-tea";
import { db } from "../sqlite";

export const getCustomTeas = async (): Promise<CustomTea[]> => {
  try {
    return await db.getAllAsync<CustomTea>(
      "SELECT * FROM custom_teas ORDER BY created_at DESC",
    );
  } catch (error) {
    console.error("Error getting custom teas:", error);
    return [];
  }
};
