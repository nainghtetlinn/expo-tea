import { LocalizedText as Text } from "@/components/localized-text";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, Card } from "react-native-paper";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const lang = i18n.language as "en" | "my";

  return (
    <ScrollView className="flex-1 p-4">
      <Card>
        <Card.Content>
          <View className="flex flex-row items-center justify-between">
            <Text variant="titleMedium">{t("settings.languages")}</Text>
            <Button
              onPress={() => router.push("/languages")}
              icon={"chevron-right"}
              compact
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              {langs[lang].nativeName}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
