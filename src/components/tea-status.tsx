import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { TeaCupProgress } from "./tea-cup-progress";

export function TeaStatus() {
  const { isMaking, progress } = useTeaDeviceContext();

  return (
    <View className="px-4 py-2">
      <Card mode="contained">
        <Card.Content>
          <View className="flex-row items-center">
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

            <View className="relative h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-white">
              <View className="relative mt-2 ml-1">
                <TeaCupProgress totalHeight={54} />
              </View>
              <View className="absolute top-8 left-4 w-9 items-center">
                <Text variant="bodySmall">
                  {isMaking ? progress + "%" : "?"}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
