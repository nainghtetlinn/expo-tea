import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/stores/device-store";
import { TeaCupProgress } from "./tea-cup";

export function TeaStatus() {
  const theme = useTheme();
  const {
    isMaking,
    progress,
    isCleaning,
    cleaningProgress,
    cleaningRemainingSeconds,
  } = useDeviceStore();
  const isFinished = progress === 100;
  const { t } = useTranslation();
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: cleaningProgress / 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [cleaningProgress]);

  return (
    <Surface
      mode="flat"
      style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
    >
      {/* Tea Brewing Status */}
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

      {/* Cleaning Status */}
      {isCleaning && (
        <View style={{ overflow: "hidden" }}>
          {/* Label + remaining seconds */}
          <View className="flex-row items-center justify-between px-4 pt-2 pb-1.5">
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="labelSmall"
            >
              {t("machine.cleaningInProgress")}
            </Text>
            {cleaningRemainingSeconds > 0 && (
              <Text
                style={{ color: theme.colors.onSurfaceVariant }}
                variant="labelSmall"
              >
                {cleaningRemainingSeconds}s
              </Text>
            )}
          </View>
          {/* Animated fill bar */}
          <View
            style={{ height: 3, backgroundColor: theme.colors.surfaceVariant }}
          >
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: theme.colors.primary,
                width: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        </View>
      )}
    </Surface>
  );
}
