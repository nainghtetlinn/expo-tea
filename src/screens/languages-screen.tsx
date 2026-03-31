import { LANGUAGE_STORAGE_KEY } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

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
        <Card
          key={k}
          mode="contained"
          onPress={() => handleLanguageChange(k as "en" | "my")}
        >
          <Card.Content>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyMedium" style={{ lineHeight: 32 }}>
                {v.nativeName}
              </Text>
              {i18n.resolvedLanguage === k && (
                <Icon source={"check"} size={20} color={theme.colors.primary} />
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}
