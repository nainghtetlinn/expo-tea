import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { TeaCupProgress } from "./tea-cup-progress";

export function TeaStatus() {
  const { isMaking, progress } = useTeaDeviceContext();

  if (!isMaking && progress === 0) return null;

  return (
    <View className="px-4 py-2">
      <Card mode="contained">
        <Card.Content>
          <View className="flex-row items-center">
            <View className="mr-4 flex-1">
              <View className="mb-1 flex-row items-center gap-2">
                {progress < 100 && (
                  <View className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                )}
                <Text variant="titleMedium">
                  {progress === 100 ? "Tea is Ready!" : "Now Brewing"}
                </Text>
              </View>

              <Text variant="bodySmall" className="mb-4">
                {progress === 100
                  ? "Please remove your cup."
                  : `Mixing ingredients... ${progress}%`}
              </Text>

              <View className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100">
                <View
                  className="h-full rounded-full bg-orange-400"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>

            <View className="relative h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-white">
              <View className="mt-2 ml-1">
                <TeaCupProgress totalHeight={54} />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
