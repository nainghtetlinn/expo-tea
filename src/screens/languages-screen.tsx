import { TouchableOpacity, View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";
import { usePreferencesStore } from "@/stores/preferences-store";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function LanguagesScreen() {
  const theme = useTheme();
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  return (
    <View className="flex-1 gap-4 p-4">
      {Object.entries(langs).map(([k, v]) => (
        <TouchableOpacity key={k} onPress={() => setLanguage(k as "en" | "my")}>
          <Surface
            mode="flat"
            style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
          >
            <View className="flex-row items-center justify-between p-4">
              <Text style={{ lineHeight: 32 }} variant="bodyMedium">
                {v.nativeName}
              </Text>
              {language === k && (
                <Icon color={theme.colors.primary} size={20} source={"check"} />
              )}
            </View>
          </Surface>
        </TouchableOpacity>
      ))}
    </View>
  );
}
