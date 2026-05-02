import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { HomeWalkthroughContent } from "@/components/home-walkthrough-content";
import { TeaCard } from "@/components/tea-card";
import { TeaStatus } from "@/components/tea-status";
import { recipes as presetRecipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";

export function HomeScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";
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
      {/* Step 2: Tea progress */}
      <View className="px-4">
        <HomeWalkthroughContent step={2}>
          <View className="w-full">
            <TeaStatus />
          </View>
        </HomeWalkthroughContent>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {customRecipes.length > 0 && (
          <>
            <Text className="mb-2 opacity-60" variant="labelLarge">
              {t("home.Custom Teas")}
            </Text>
            <View className="gap-4">
              {customRecipes.map((r) => (
                <View key={r.id}>
                  <TeaCard
                    description={r.description}
                    ingredients={{
                      tea: r.tea,
                      condensedMilk: r.condensedMilk,
                      evaporatedMilk: r.evaporatedMilk,
                      milk: r.milk,
                    }}
                    name={r.name}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <Text className="mt-6 mb-2 opacity-60" variant="labelLarge">
          {t("home.Preset Teas")}
        </Text>
        <View className="gap-4">
          {/* Step 3: Tea item to prepare — wraps the first preset card */}
          {presetRecipes.map((r, i) =>
            i === 0 ? (
              <HomeWalkthroughContent key={r.id} step={3}>
                <View className="w-full">
                  <TeaCard
                    description={r.description[lang]}
                    ingredients={r.ingredients}
                    name={r.name[lang]}
                  />
                </View>
              </HomeWalkthroughContent>
            ) : (
              <View key={r.id}>
                <TeaCard
                  description={r.description[lang]}
                  ingredients={r.ingredients}
                  name={r.name[lang]}
                />
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
}
