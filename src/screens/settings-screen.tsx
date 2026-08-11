import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SegmentedButtons, Surface, Text, useTheme } from "react-native-paper";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useWalkthroughStore } from "@/stores/walkthrough-store";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const { connectedDevice } = useBluetoothStore();
  const themeMode = usePreferencesStore((state) => state.theme);
  const setThemeMode = usePreferencesStore((state) => state.setTheme);
  const resetWalkthrough = useWalkthroughStore(
    (state) => state.resetWalkthrough,
  );

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-4" contentContainerClassName="gap-4 pb-8">
        <TouchableOpacity onPress={() => router.push("/languages")}>
          <Surface
            mode="flat"
            style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
          >
            <View className="flex flex-row items-center justify-between p-4">
              <Text variant="titleMedium">{t("settings.languages")}</Text>
              <View className="flex-row items-center gap-2">
                <Text variant="bodyMedium">{langs[lang].nativeName}</Text>
                <MaterialIcons
                  color={theme.colors.onBackground}
                  name="chevron-right"
                  size={18}
                />
              </View>
            </View>
          </Surface>
        </TouchableOpacity>

        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="flex flex-col gap-4 p-4">
            <Text variant="titleMedium">
              {t("settings.theme", { defaultValue: "Theme" })}
            </Text>
            <SegmentedButtons
              buttons={[
                { value: "system", label: "Auto", icon: "theme-light-dark" },
                { value: "light", label: "Light", icon: "weather-sunny" },
                { value: "dark", label: "Dark", icon: "weather-night" },
              ]}
              onValueChange={setThemeMode}
              value={themeMode}
            />
          </View>
        </Surface>

        <TouchableOpacity onPress={() => router.push("/bluetooth")}>
          <Surface
            mode="flat"
            style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
          >
            <View className="flex flex-row items-center justify-between p-4">
              <Text variant="titleMedium">{t("settings.bluetooth")}</Text>
              <View className="flex-row items-center gap-2">
                <Text variant="bodyMedium">
                  {connectedDevice?.name ?? t("settings.disconnected")}
                </Text>
                <MaterialIcons
                  color={theme.colors.onBackground}
                  name="chevron-right"
                  size={18}
                />
              </View>
            </View>
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!connectedDevice}
          onPress={() => router.push("/machine")}
        >
          <Surface
            mode="flat"
            style={{
              borderRadius: theme.roundness * 3,
              overflow: "hidden",
              opacity: !connectedDevice ? 0.6 : 1,
            }}
          >
            <View className="flex flex-row items-center justify-between p-4">
              <Text variant="titleMedium">{t("settings.machine")}</Text>
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  color={theme.colors.onBackground}
                  name="chevron-right"
                  size={18}
                />
              </View>
            </View>
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            resetWalkthrough();
            router.push("/(tabs)/home");
          }}
        >
          <Surface
            mode="flat"
            style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
          >
            <View className="p-4">
              <Text variant="titleMedium">
                {t("settings.resetWalkthrough")}
              </Text>
            </View>
          </Surface>
        </TouchableOpacity>
      </ScrollView>

      <View className="items-center gap-1 pb-4">
        <Text
          onPress={() => router.push("/terms")}
          style={{ color: theme.colors.primary }}
          variant="bodyMedium"
        >
          Terms & Conditions
        </Text>
        <Text variant="bodySmall">Version {appVersion}</Text>
        <Text variant="bodySmall">Developed by Naing Htet Linn</Text>
      </View>
    </View>
  );
}
