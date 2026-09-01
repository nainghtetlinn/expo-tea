import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ButtonInfo, DeviceInfo } from "@/types/device";
import type { TeaIngredients } from "@/types/tea";

type ButtonInfos = {
  btn0: ButtonInfo;
  btn1: ButtonInfo;
  btn2: ButtonInfo;
};

// ── State ──────────────────────────────────────────────────────────────────

type DeviceState = {
  buttonInfos: ButtonInfos | null;
  deviceInfo: DeviceInfo | null;

  // Tea brewing
  isMaking: boolean;
  progress: number; // 0–100
  targetIngredients: TeaIngredients | null;
  currentProgress: TeaIngredients | null;

  // Cleaning
  isCleaning: boolean;
  cleaningProgress: number; // 0–100
  cleaningRemainingSeconds: number;
  cleaningFinished: boolean;
};

// ── Actions ────────────────────────────────────────────────────────────────

type DeviceActions = {
  setButtonInfos: (buttonInfos: ButtonInfos) => void;
  setDeviceInfo: (deviceInfo: DeviceInfo) => void;
  updateTemperature: (temperature: number) => void;
  updateWeight: (weight: number) => void;

  teaStart: (ingredients: TeaIngredients) => void;
  teaProgress: (current: TeaIngredients, percentage: number) => void;
  teaFinish: () => void;
  cupRemoved: () => void;
  cupWarning: () => void;

  cleaningStart: (durationSeconds: number) => void;
  updateCleaningProgress: (progress: number, remainingSeconds: number) => void;
  cleaningFinish: () => void;
  cleaningCancel: () => void;
  dismissCleaning: () => void;
};

type DeviceStoreState = DeviceState & DeviceActions;

// ── Store ──────────────────────────────────────────────────────────────────

const initialState: DeviceState = {
  buttonInfos: null,
  deviceInfo: null,

  isMaking: false,
  progress: 0,
  targetIngredients: null,
  currentProgress: null,

  isCleaning: false,
  cleaningProgress: 0,
  cleaningRemainingSeconds: 0,
  cleaningFinished: false,
};

export const useDeviceStore = create<DeviceStoreState>()(
  immer((set) => ({
    ...initialState,

    setButtonInfos: (buttonInfos) =>
      set((s) => {
        s.buttonInfos = buttonInfos;
      }),

    setDeviceInfo: (deviceInfo) =>
      set((s) => {
        s.deviceInfo = deviceInfo;
      }),

    updateTemperature: (temperature) =>
      set((s) => {
        if (s.deviceInfo) s.deviceInfo.temperature = temperature;
      }),

    updateWeight: (weight) =>
      set((s) => {
        if (s.deviceInfo) s.deviceInfo.weight = weight;
      }),

    teaStart: (ingredients) =>
      set((s) => {
        s.isMaking = true;
        s.targetIngredients = ingredients;
        s.currentProgress = {
          tea: 0,
          condensedMilk: 0,
          evaporatedMilk: 0,
          milk: 0,
        };
        s.progress = 0;
      }),

    teaProgress: (current, percentage) =>
      set((s) => {
        s.currentProgress = current;
        s.progress = percentage;
      }),

    teaFinish: () =>
      set((s) => {
        s.isMaking = false;
        s.progress = 100;
      }),

    cupRemoved: () =>
      set((s) => {
        s.isMaking = false;
        s.progress = 0;
        s.targetIngredients = null;
        s.currentProgress = null;
      }),

    cupWarning: () =>
      set((s) => {
        s.isMaking = false;
        s.progress = 0;
      }),

    cleaningStart: (durationSeconds) =>
      set((s) => {
        s.isCleaning = true;
        s.cleaningProgress = 0;
        s.cleaningRemainingSeconds = durationSeconds;
        s.cleaningFinished = false;
      }),

    updateCleaningProgress: (progress, remainingSeconds) =>
      set((s) => {
        s.cleaningProgress = progress;
        s.cleaningRemainingSeconds = remainingSeconds;
      }),

    cleaningFinish: () =>
      set((s) => {
        s.isCleaning = false;
        s.cleaningProgress = 100;
        s.cleaningRemainingSeconds = 0;
        s.cleaningFinished = true;
      }),

    cleaningCancel: () =>
      set((s) => {
        s.isCleaning = false;
        s.cleaningProgress = 0;
        s.cleaningRemainingSeconds = 0;
        s.cleaningFinished = false;
      }),

    dismissCleaning: () =>
      set((s) => {
        s.isCleaning = false;
        s.cleaningProgress = 0;
        s.cleaningRemainingSeconds = 0;
        s.cleaningFinished = false;
      }),
  })),
);
