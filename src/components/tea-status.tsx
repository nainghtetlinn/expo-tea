import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/stores/device-store";
import { TeaCupProgress } from "./tea-cup";

export function TeaStatus() {
  const theme = useTheme();
  const { isMaking, progress } = useDeviceStore();
  const isFinished = progress === 100;

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      <View className="flex-row items-center p-4">
        <View className="mr-4 flex-1">
          <View className="mb-1 flex-row gap-2">
            <View
              className={cn(
                "mt-1.5 h-3 w-3 rounded-full",
                isFinished
                  ? "bg-success-foreground"
                  : isMaking
                    ? "bg-warning-foreground"
                    : "bg-error-foreground",
              )}
            />

            <View className="mb-4 gap-1">
              <Text variant="titleMedium">
                {isFinished
                  ? "Tea is Ready!"
                  : isMaking
                    ? "Now Brewing"
                    : "Let's Brew Tea"}
              </Text>
              <Text variant="bodySmall">
                {isFinished
                  ? "Please remove your cup."
                  : isMaking
                    ? "Mixing ingredients..."
                    : "Select Tea to start brewing"}
              </Text>
            </View>
          </View>

          <View className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100">
            <View
              className="h-full rounded-full bg-orange-400"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <Surface
          elevation={3}
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="relative h-19 w-19 items-center justify-center">
            <View className="relative mt-2 ml-1">
              <TeaCupProgress totalHeight={54} />
            </View>
            <View className="absolute top-8 left-4 w-9 items-center">
              <Text variant="bodySmall">
                {isFinished || isMaking ? progress + "%" : "?"}
              </Text>
            </View>
          </View>
        </Surface>
      </View>
    </Surface>
  );
}
