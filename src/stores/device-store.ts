import { create } from "zustand";
import type { ButtonInfo } from "@/contracts/deviceNotifications";
import type { TeaIngredients } from "@/types/tea";

type DeviceStoreState = {
  targetIngredients: TeaIngredients | null;
  currentProgress: TeaIngredients | null;
  isMaking: boolean;
  progress: number;
  buttonInfos: {
    btn0: ButtonInfo;
    btn1: ButtonInfo;
    btn2: ButtonInfo;
  } | null;

  setDeviceData: (data: Partial<DeviceStoreState>) => void;
  calculateProgress: () => void;
};

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  targetIngredients: null,
  currentProgress: null,
  isMaking: false,
  progress: 0,
  buttonInfos: null,

  setDeviceData: (data) => set((state) => ({ ...state, ...data })),
  calculateProgress: () => {
    const { isMaking, targetIngredients, currentProgress } = get();
    if (!isMaking || !targetIngredients || !currentProgress)
      return set({ progress: 0 });

    const targetTotal = Object.values(targetIngredients).reduce(
      (a, b) => a + b,
      0,
    );
    const currentTotal = Object.values(currentProgress).reduce(
      (a, b) => a + b,
      0,
    );

    if (targetTotal === 0) return set({ progress: 0 });

    set({ progress: Math.floor((currentTotal * 100) / targetTotal) });
  },
}));
