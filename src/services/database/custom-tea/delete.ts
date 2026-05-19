import { db } from "../sqlite";

export const deleteCustomTea = async (id: number): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM custom_teas WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting custom tea:", error);
    return false;
  }
};
