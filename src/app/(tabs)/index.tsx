import { HomeScreen } from "@/screens/home-screen";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeTab() {
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
      <HomeScreen />
    </View>
  );
}
