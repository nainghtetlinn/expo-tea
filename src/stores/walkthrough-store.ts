import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const WALKTHROUGH_SEEN_KEY = "app_walkthrough_seen";

type WalkthroughStoreState = {
  seen: boolean;
  step: number;
  totalSteps: number;
  _hasHydrated: boolean;

  nextStep: () => void;
  prevStep: () => void;
  skipAll: () => void;
  isActiveStep: (step: number) => boolean;
  setHasHydrated: (value: boolean) => void;
  resetWalkthrough: () => void;
};

export const useWalkthroughStore = create<WalkthroughStoreState>()(
  persist(
    (set, get) => ({
      seen: false,
      step: 1,
      totalSteps: 7,
      _hasHydrated: false,

      nextStep: () =>
        set((state) =>
          state.step === state.totalSteps
            ? { seen: true, step: 0 }
            : { step: state.step + 1 },
        ),
      prevStep: () =>
        set((state) => (state.step > 1 ? { step: state.step - 1 } : state)),
      skipAll: () => set({ seen: true, step: 0 }),
      isActiveStep: (s) => get().step === s,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      resetWalkthrough: () => set({ seen: false, step: 1 }),
    }),

    {
      name: WALKTHROUGH_SEEN_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        seen: state.seen,
        step: state.step,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
