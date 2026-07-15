import { create } from "zustand";
import type { ButtonInfo } from "@/types/device";
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
};

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  targetIngredients: null,
  currentProgress: null,
  isMaking: false,
  progress: 0,
  buttonInfos: null,

  setDeviceData: (data) => set((state) => ({ ...state, ...data })),
}));
