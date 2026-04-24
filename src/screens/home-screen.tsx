import { HomeWalkthroughContent } from "@/components/home-walkthrough-content";
import { TeaCard } from "@/components/tea-card";
import { TeaStatus } from "@/components/tea-status";
import { recipes as presetRecipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { useWalkthrough } from "@/lib/walkthrough-context";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";

export function HomeScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";
  const { loading, customRecipes } = useTeaContext();
  const { isStep } = useWalkthrough();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2">
      {/* Step 2: Tea Progress */}
      <Tooltip
        isVisible={isStep(2)}
        content={<HomeWalkthroughContent step={2} />}
        placement="bottom"
        allowChildInteraction={false}
        contentStyle={{
          maxWidth: 320,
          padding: 0,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 3,
        }}
        displayInsets={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={{ width: "100%" }}>
          <TeaStatus />
        </View>
      </Tooltip>

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {customRecipes.length > 0 && (
          <>
            <Text variant="labelLarge" className="mb-2 opacity-60">
              {t("home.Custom Teas")}
            </Text>
            <View className="gap-4">
              {customRecipes.map((r) => (
                <View key={r.id}>
                  <TeaCard
                    name={r.name}
                    description={r.description}
                    ingredients={{
                      tea: r.tea,
                      condensedMilk: r.condensedMilk,
                      evaporatedMilk: r.evaporatedMilk,
                      milk: r.milk,
                    }}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <Text variant="labelLarge" className="mt-6 mb-2 opacity-60">
          {t("home.Preset Teas")}
        </Text>
        <View className="gap-4">
          {/* Step 3: Tea item to prepare — wraps the first preset card */}
          {presetRecipes.map((r, i) =>
            i === 0 ? (
              <Tooltip
                key={r.id}
                isVisible={isStep(3)}
                content={<HomeWalkthroughContent step={3} />}
                placement="bottom"
                allowChildInteraction={false}
                contentStyle={{
                  maxWidth: 320,
                  padding: 0,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.roundness * 3,
                }}
                displayInsets={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View className="w-full">
                  <TeaCard
                    name={r.name[lang]}
                    description={r.description[lang]}
                    ingredients={r.ingredients}
                  />
                </View>
              </Tooltip>
            ) : (
              <View key={r.id}>
                <TeaCard
                  name={r.name[lang]}
                  description={r.description[lang]}
                  ingredients={r.ingredients}
                />
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
}
