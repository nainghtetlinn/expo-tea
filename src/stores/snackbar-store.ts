import { create } from "zustand";

type SnackbarStoreState = {
  visible: boolean;
  text: string;

  toast: (message: string) => void;
  hide: () => void;
};

export const useSnackbarStore = create<SnackbarStoreState>((set) => ({
  visible: false,
  text: "",

  toast: (message) => set({ visible: true, text: message }),
  hide: () => set({ visible: false, text: "" }),
}));
