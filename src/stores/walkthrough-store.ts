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
  isStep: (step: number) => boolean;
};

export const useWalkthroughStore = create<WalkthroughStoreState>()(
  persist(
    (set, get) => ({
      seen: false,
      step: 1,
      totalSteps: 3,
      nextStep: () => {
        const state = get();
        if (state.step >= state.totalSteps) {
          set({ step: 0, seen: true });
        } else {
          set({ step: state.step + 1 });
        }
      },
      skipAll: () => set({ step: 0, seen: true }),
      isStep: (s) => get().step === s,
    }),
    {
      name: WALKTHROUGH_SEEN_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        seen: state.seen,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.seen) {
          state.step = 0;
        }
      },
    },
  ),
);
