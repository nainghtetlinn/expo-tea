import { SettingsScreen } from "@/screens/settings-screen";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsTab() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <View className="items-center pt-4 pb-2">
        <Text variant="titleLarge">Settings</Text>
      </View>
      <SettingsScreen />
    </View>
  );
}
