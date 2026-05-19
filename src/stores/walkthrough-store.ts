import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const WALKTHROUGH_SEEN_KEY = "app_walkthrough_seen";

type WalkthroughStoreState = {
  seen: boolean;
  step: number;
  totalSteps: number;

  nextStep: () => void;
  skipAll: () => void;
  isActiveStep: (step: number) => boolean;
};

export const useWalkthroughStore = create<WalkthroughStoreState>()(
  persist(
    (set, get) => ({
      seen: false,
      step: 1,
      totalSteps: 3,

      nextStep: () =>
        set((state) =>
          state.step === state.totalSteps
            ? { seen: true, step: 0 }
            : { step: state.step + 1 },
        ),
      skipAll: () => set({ seen: true, step: 0 }),
      isActiveStep: (s) => get().step === s,
    }),

    {
      name: WALKTHROUGH_SEEN_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        seen: state.seen,
        step: state.step,
      }),
    },
  ),
);
