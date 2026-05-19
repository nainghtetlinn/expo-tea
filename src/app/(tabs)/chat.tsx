import { AssistantRuntimeProvider } from "@assistant-ui/react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useAppRuntime } from "@/hooks/use-app-runtime";
import { ChatScreen } from "@/screens/chat-screen";

export default function ChatTab() {
  const runtime = useAppRuntime();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title={t("chat.title")} />
        </Appbar.Header>

        <ChatScreen />
      </View>
    </AssistantRuntimeProvider>
  );
}
