import { create } from "zustand";
import {
  addCustomTea,
  deleteCustomTea,
  getCustomTeas,
  initDatabase,
  updateCustomTea,
} from "@/services/database";
import type { CustomTea } from "@/types/custom-tea";

type TeaStoreState = {
  customTeas: CustomTea[];
  loading: boolean;
  initialize: () => Promise<void>;
  fetchTeas: () => Promise<void>;
  addTea: (data: Omit<CustomTea, "id" | "created_at">) => Promise<void>;
  updateTea: (
    id: number,
    data: Omit<CustomTea, "id" | "created_at">,
  ) => Promise<void>;
  deleteTea: (id: number) => Promise<void>;
};

export const useTeaStore = create<TeaStoreState>((set, get) => ({
  customTeas: [],
  loading: true,

  initialize: async () => {
    set({ loading: true });
    await initDatabase();
    await get().fetchTeas();
  },

  fetchTeas: async () => {
    try {
      const custom = await getCustomTeas();
      set({ customTeas: custom, loading: false });
    } catch (error) {
      console.error("Error loading teas:", error);
      set({ loading: false });
    }
  },

  addTea: async (data) => {
    try {
      await addCustomTea(data);
      await get().fetchTeas();
    } catch (error) {
      console.error("Error adding tea:", error);
    }
  },

  updateTea: async (id, data) => {
    try {
      await updateCustomTea(id, data);
      await get().fetchTeas();
    } catch (error) {
      console.error("Error updating tea:", error);
    }
  },

  deleteTea: async (id) => {
    try {
      await deleteCustomTea(id);
      await get().fetchTeas();
    } catch (error) {
      console.error("Error deleting tea:", error);
    }
  },
}));
