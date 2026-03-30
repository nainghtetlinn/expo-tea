import { RecipesScreen } from "@/screens/recipes-screen";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

export default function RecipesTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar.Header>
        <Appbar.Content
          title={t("recipes.title")}
          titleStyle={{ textAlign: "center" }}
        />
      </Appbar.Header>

      <RecipesScreen />
    </View>
  );
}
