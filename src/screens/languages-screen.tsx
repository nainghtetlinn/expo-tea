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

  return (
    <View className="flex-1 gap-4 p-4">
      {Object.entries(langs).map(([k, v]) => (
        <Card key={k} onPress={() => i18n.changeLanguage(k)}>
          <Card.Content>
            <View className="flex-row justify-between">
              <Text variant="bodyMedium">{v.nativeName}</Text>
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
