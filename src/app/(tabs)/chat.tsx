import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { ChatScreen } from "@/screens/chat-screen";

export default function ChatTab() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title={t("chat.title")} />
      </Appbar.Header>

      <ChatScreen />
    </View>
  );
}
