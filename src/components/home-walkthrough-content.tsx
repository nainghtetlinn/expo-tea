import type { ReactNode } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { useWalkthroughStore } from "@/stores/walkthrough-store";

const stepInfo: Record<number, { title: string; body: string }> = {
  1: {
    title: "Connect Bluetooth",
    body: "Tap this icon to scan and connect to your tea machine via Bluetooth.",
  },
  2: {
    title: "Tea Progress",
    body: "Track your current brew progress here in real time.",
  },
  3: {
    title: "Tea Recipes",
    body: "Tap a tea card to start preparing that recipe.",
  },
};

const WalkthroughContent = ({ step }: { step: number }) => {
  const info = stepInfo[step];
  const { totalSteps, nextStep, skipAll } = useWalkthroughStore();
  const isLast = step === totalSteps;

  return (
    <View className="p-4">
      <Text className="mb-2" variant="titleMedium">
        {info.title}
      </Text>
      <Text className="mb-4" variant="bodySmall">
        {info.body}
      </Text>
      <View className="flex-row items-center justify-between">
        <Button compact mode="text" onPress={skipAll}>
          Skip
        </Button>
        <Text variant="labelSmall">
          {step} / {totalSteps}
        </Text>
        <Button compact mode="text" onPress={nextStep}>
          {isLast ? "Done" : "Next"}
        </Button>
      </View>
    </View>
  );
};

export function HomeWalkthroughContent({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  const theme = useTheme();
  const { seen, isActiveStep } = useWalkthroughStore();

  if (seen) return children;

  return (
    <Tooltip
      allowChildInteraction={false}
      childrenWrapperStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness * 3,
        overflow: "hidden",
      }}
      content={<WalkthroughContent step={step} />}
      contentStyle={{
        maxWidth: 320,
        padding: 0,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness * 3,
      }}
      displayInsets={{ top: 8, bottom: 8, left: 8, right: 8 }}
      isVisible={isActiveStep(step)}
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
}
