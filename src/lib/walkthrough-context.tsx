import { createContext, useContext, useState, type ReactNode } from "react";

const TOTAL_STEPS = 3;

type WalkthroughContextType = {
  step: number;
  totalSteps: number;
  isStep: (s: number) => boolean;
  nextStep: () => void;
  skipAll: () => void;
};

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => (s >= TOTAL_STEPS ? 0 : s + 1));
  const skipAll = () => setStep(0);
  const isStep = (s: number) => step === s;

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
