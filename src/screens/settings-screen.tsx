import { useBluetoothContext } from "@/lib/bluetooth-context";
import { ThemeMode, useThemeContext } from "@/lib/theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SegmentedButtons, Surface, Text, useTheme } from "react-native-paper";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const { connectedDevice } = useBluetoothContext();
  const { themeMode, setThemeMode } = useThemeContext();

  return (
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
                name="chevron-right"
                size={18}
                color={theme.colors.onBackground}
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
            value={themeMode}
            onValueChange={(value) => setThemeMode(value as ThemeMode)}
            buttons={[
              { value: "system", label: "Auto", icon: "theme-light-dark" },
              { value: "light", label: "Light", icon: "weather-sunny" },
              { value: "dark", label: "Dark", icon: "weather-night" },
            ]}
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
                {connectedDevice?.name ?? "Disconnected"}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={18}
                color={theme.colors.onBackground}
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
                name="chevron-right"
                size={18}
                color={theme.colors.onBackground}
              />
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </ScrollView>
  );
}
