import { useBluetoothContext } from "@/lib/bluetooth-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export function SettingsScreen() {
  const router = useRouter();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const { connectedDevice } = useBluetoothContext();

  return (
    <ScrollView className="flex-1 p-4" contentContainerClassName="gap-4">
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

      <Card>
        <Card.Content>
          <View className="flex flex-row items-center justify-between">
            <Text variant="titleMedium">{t("settings.bluetooth")}</Text>
            <Button
              onPress={() => router.push("/bluetooth")}
              icon={"chevron-right"}
              compact
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              {connectedDevice?.name ?? "Disconnected"}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
