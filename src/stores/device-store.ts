import { create } from "zustand";
import type { ButtonInfo, DeviceInfo } from "@/types/device";
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
  deviceInfo: DeviceInfo | null;

  setDeviceData: (data: Partial<DeviceStoreState>) => void;
};

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  targetIngredients: null,
  currentProgress: null,
  isMaking: false,
  progress: 0,
  buttonInfos: null,
  deviceInfo: null,

  setDeviceData: (data) => set((state) => ({ ...state, ...data })),
}));
