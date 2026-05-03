import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";
import { LANGUAGE_STORAGE_KEY } from "@/i18n";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function LanguagesScreen() {
  const theme = useTheme();
  const { i18n } = useTranslation();

  const handleLanguageChange = async (language: "en" | "my") => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Unable to save language preference:", error);
    }
  };

  return (
    <View className="flex-1 gap-4 p-4">
      {Object.entries(langs).map(([k, v]) => (
        <TouchableOpacity
          key={k}
          onPress={() => handleLanguageChange(k as "en" | "my")}
        >
          <Surface
            mode="flat"
            style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
          >
            <View className="flex-row items-center justify-between p-4">
              <Text style={{ lineHeight: 32 }} variant="bodyMedium">
                {v.nativeName}
              </Text>
              {i18n.resolvedLanguage === k && (
                <Icon color={theme.colors.primary} size={20} source={"check"} />
              )}
            </View>
          </Surface>
        </TouchableOpacity>
      ))}
    </View>
  );
}
