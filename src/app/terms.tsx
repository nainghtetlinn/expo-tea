import { TermsScreen } from "@/screens/terms-screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

export default function Terms() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={"Terms & Conditions"} />
      </Appbar.Header>

      <TermsScreen />
    </View>
  );
}
