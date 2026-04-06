import { TeaCard } from "@/components/tea-card";
import { TeaStatus } from "@/components/tea-status";
import { recipes as presetRecipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export function HomeScreen() {
  const { t } = useTranslation();
  const { loading, customRecipes } = useTeaContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2">
      <TeaStatus />

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {customRecipes.length > 0 && (
          <>
            <Text variant="labelLarge" className="py-2 opacity-60">
              {t("home.Custom Teas")}
            </Text>
            {customRecipes.map((r) => (
              <View key={r.id} className="mb-4">
                <TeaCard tea={r} />
              </View>
            ))}
          </>
        )}

        <Text variant="labelLarge" className="py-2 opacity-60">
          {t("home.Preset Teas")}
        </Text>
        {presetRecipes.map((r) => (
          <View key={r.id} className="mb-4">
            <TeaCard tea={r} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
