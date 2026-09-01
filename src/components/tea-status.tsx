import { View } from "react-native";
import { ProgressBar, Surface, Text, useTheme } from "react-native-paper";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/stores/device-store";
import { TeaCupProgress } from "./tea-cup";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export function TeaStatus() {
  const theme = useTheme();
  const {
    isMaking,
    progress,
    isCleaning,
    cleaningProgress,
    cleaningRemainingSeconds,
    cleaningFinished,
  } = useDeviceStore();
  const isFinished = progress === 100;

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
      {(isCleaning || cleaningFinished) && (
        <View
          className="gap-2 px-4 pb-4"
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.colors.outlineVariant,
          }}
        >
          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center gap-2">
              <View
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  cleaningFinished ? "bg-success-foreground" : "bg-primary",
                )}
              />
              <Text
                style={{ color: theme.colors.onSurfaceVariant }}
                variant="labelMedium"
              >
                {cleaningFinished
                  ? "Cleaning Complete"
                  : "Cleaning in Progress"}
              </Text>
            </View>
            {!cleaningFinished && cleaningRemainingSeconds > 0 && (
              <Text
                style={{ color: theme.colors.onSurfaceVariant }}
                variant="bodySmall"
              >
                {formatTime(cleaningRemainingSeconds)} remaining
              </Text>
            )}
          </View>

          <ProgressBar
            animatedValue={cleaningProgress / 100}
            color={
              cleaningFinished ? theme.colors.secondary : theme.colors.primary
            }
            style={{ height: 6, borderRadius: 3 }}
          />

          <Text
            style={{ color: theme.colors.onSurfaceVariant, textAlign: "right" }}
            variant="bodySmall"
          >
            {Math.round(cleaningProgress)}%
          </Text>
        </View>
      )}
    </Surface>
  );
}
