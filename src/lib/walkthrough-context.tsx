import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const TOTAL_STEPS = 3;

type WalkthroughContextType = {
  step: number;
  totalSteps: number;
  isStep: (s: number) => boolean;
  nextStep: () => void;
  skipAll: () => void;
};

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

const WALKTHROUGH_SEEN_KEY = "app_walkthrough_seen";

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step >= TOTAL_STEPS) {
      setStep(0);
      AsyncStorage.setItem(WALKTHROUGH_SEEN_KEY, "seen");
    } else {
      setStep(step + 1);
    }
  };
  const skipAll = () => {
    setStep(0);
    AsyncStorage.setItem(WALKTHROUGH_SEEN_KEY, "seen");
  };
  const isStep = (s: number) => step === s;

  useEffect(() => {
    AsyncStorage.getItem(WALKTHROUGH_SEEN_KEY).then((seen) => {
      if (!seen) {
        setStep(1);
      }
    });
  }, []);

  return (
    <WalkthroughContext.Provider
      value={{ step, totalSteps: TOTAL_STEPS, isStep, nextStep, skipAll }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const ctx = useContext(WalkthroughContext);
  if (!ctx)
    throw new Error("useWalkthrough must be used within WalkthroughProvider");
  return ctx;
}
