import {
  type ThreadMessage,
  useAui,
  useAuiState,
} from "@assistant-ui/react-native";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

function MessageBubble({ message }: { message: ThreadMessage }) {
  const isUser = message.role === "user";
  const text = message.content
    .filter((p) => p.type === "text")
    .map((p) => ("text" in p ? p.text : ""))
    .join("\n");
  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#007aff" : "#f0f0f0",
        borderRadius: 16,
        padding: 12,
        marginVertical: 4,
        marginHorizontal: 16,
        maxWidth: "80%",
      }}
    >
      <Text style={{ color: isUser ? "#fff" : "#000" }}>{text}</Text>
    </View>
  );
}

function Composer() {
  const aui = useAui();
  const text = useAuiState((s) => s.composer.text);
  const isEmpty = useAuiState((s) => s.composer.isEmpty);
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        alignItems: "flex-end",
      }}
    >
      <TextInput
        multiline
        onChangeText={(t) => aui.composer().setText(t)}
        placeholder="Message..."
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          maxHeight: 120,
        }}
        value={text}
      />
      <Pressable
        disabled={isEmpty}
        onPress={() => aui.composer().send()}
        style={{
          marginLeft: 8,
          backgroundColor: !isEmpty ? "#007aff" : "#ccc",
          borderRadius: 20,
          width: 36,
          height: 36,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>↑</Text>
      </Pressable>
    </View>
  );
}

export function ChatScreen() {
  const messages = useAuiState(
    (s) => s.thread.messages,
  ) as unknown as ThreadMessage[];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
      />
      <Composer />
    </KeyboardAvoidingView>
  );
}
