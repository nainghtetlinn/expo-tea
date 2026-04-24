import { useWalkthrough } from "@/lib/walkthrough-context";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

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

export function HomeWalkthroughContent({ step }: { step: number }) {
  const { totalSteps, nextStep, skipAll } = useWalkthrough();
  const info = stepInfo[step];
  const isLast = step === totalSteps;

  return (
    <View className="p-4">
      <Text variant="titleMedium" className="mb-2">
        {info.title}
      </Text>
      <Text variant="bodySmall" className="mb-4">
        {info.body}
      </Text>
      <View className="flex-row items-center justify-between">
        <Button mode="text" compact onPress={skipAll}>
          Skip
        </Button>
        <Text variant="labelSmall">
          {step} / {totalSteps}
        </Text>
        <Button mode="text" compact onPress={nextStep}>
          {isLast ? "Done" : "Next"}
        </Button>
      </View>
    </View>
  );
}
