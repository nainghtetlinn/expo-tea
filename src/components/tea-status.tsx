import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/stores/device-store";
import { TeaCupProgress } from "./tea-cup";

export function TeaStatus() {
  const theme = useTheme();
  const { isMaking, progress } = useDeviceStore();

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
                !isMaking
                  ? "bg-error-foreground"
                  : progress === 100
                    ? "bg-success-foreground"
                    : "bg-warning-foreground",
              )}
            />

            <View className="mb-4 gap-1">
              <Text variant="titleMedium">
                {!isMaking
                  ? "Let's Brew Tea"
                  : progress === 100
                    ? "Tea is Ready!"
                    : "Now Brewing"}
              </Text>
              <Text variant="bodySmall">
                {!isMaking
                  ? "Select Tea to start brewing"
                  : progress === 100
                    ? "Please remove your cup."
                    : "Mixing ingredients..."}
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
              <Text variant="bodySmall">{isMaking ? progress + "%" : "?"}</Text>
            </View>
          </View>
        </Surface>
      </View>
    </Surface>
  );
}
