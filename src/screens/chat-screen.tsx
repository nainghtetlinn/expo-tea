import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import { IconButton, Surface, useTheme } from "react-native-paper";
import {
  EmptyState,
  MessageBubble,
  RecipeMessageBubble,
  StreamMessageBubble,
  TypingIndicator,
} from "@/components/chat";
import { MakeTeaDialog } from "@/components/dialogs";
import {
  type RecipeFormValues,
  TeaRecipeFormDialog,
} from "@/components/dialogs/tea-recipe-form-dialog";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";
import { createId } from "@/lib/utils";
import { streamChatPreferences } from "@/services/chat";
import { useSnackbarStore } from "@/stores/snackbar-store";
import { useTeaStore } from "@/stores/tea-store";
import type { ChatMessage } from "@/types/chat";
import type { TeaIngredients } from "@/types/tea";

export function ChatScreen() {
  const keyboardHeight = useKeyboardHeight();
  const theme = useTheme();
  const { t } = useTranslation();
  const { addTea } = useTeaStore();
  const toast = useSnackbarStore((state) => state.toast);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prepareRecipe, setPrepareRecipe] = useState<TeaIngredients | null>(
    null,
  );
  const [saveRecipe, setSaveRecipe] = useState<TeaIngredients | null>(null);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0) {
      scrollToEnd();
    }
  }, [keyboardHeight, scrollToEnd]);

  /** Strip the trailing ```json ... ``` block from text shown during streaming */
  const stripJsonBlock = (text: string) =>
    text.replace(/```json[\s\S]*$/, "").trimEnd();

  const requestRecipe = async (preferences: string) => {
    setLoading(true);
    scrollToEnd();

    const streamMessageId = createId();

    // Add an empty streaming message
    setMessages((prev) => [
      ...prev,
      {
        id: streamMessageId,
        role: "assistant",
        kind: "stream",
        text: "",
        streaming: true,
      },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const { text, recipe } = await streamChatPreferences(
        preferences,
        (accumulatedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamMessageId
                ? { ...msg, text: stripJsonBlock(accumulatedText) }
                : msg,
            ),
          );
          scrollToEnd();
        },
        abortControllerRef.current.signal,
      );

      // Finalize the streaming message with the recipe
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamMessageId
            ? { ...msg, text, recipe, streaming: false }
            : msg,
        ),
      );
    } catch (error) {
      // Remove the streaming message and add an error message
      if ((error as Error).name !== "AbortError") {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== streamMessageId),
          {
            id: createId(),
            role: "assistant",
            kind: "error",
            text: t("chat.requestFailed"),
            preferences,
          },
        ]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      scrollToEnd();
    }
  };

  const submitPreferences = async (preferences: string) => {
    if (!preferences || loading) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text: preferences,
    };

    setMessages((prev) => [...prev, userMessage]);
    await requestRecipe(preferences);
  };

  const handleSend = async () => {
    const preferences = input.trim();
    if (!preferences) return;
    setInput("");
    await submitPreferences(preferences);
  };

  const handleRetry = async (messageId: string, preferences: string) => {
    if (!preferences || loading) return;
    setMessages((prev) => prev.filter((message) => message.id !== messageId));
    await requestRecipe(preferences);
  };

  const handleSuggestionPress = async (preferences: string) => {
    await submitPreferences(preferences.trim());
  };

  const handleSaveRecipe = async (data: RecipeFormValues) => {
    await addTea({
      name: data.name,
      description: data.description,
      tea: data.tea,
      condensedMilk: data.condensedMilk,
      evaporatedMilk: data.evaporatedMilk,
      milk: data.milk,
    });
    setSaveRecipe(null);
    toast(t("chat.recipeSaved"));
  };

  const saveDefaultValues: RecipeFormValues | undefined = saveRecipe
    ? {
        name: "",
        description: "",
        ...saveRecipe,
      }
    : undefined;

  return (
    <>
      <MakeTeaDialog
        ingredients={
          prepareRecipe ?? {
            tea: 0,
            condensedMilk: 0,
            evaporatedMilk: 0,
            milk: 0,
          }
        }
        name={t("chat.aiRecipe")}
        onClose={() => setPrepareRecipe(null)}
        visible={prepareRecipe !== null}
      />

      <TeaRecipeFormDialog
        defaultValues={saveDefaultValues}
        onClose={() => setSaveRecipe(null)}
        onSubmit={handleSaveRecipe}
        submitLabel={t("Add")}
        title={t("chat.saveRecipe")}
        visible={saveRecipe !== null}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, position: "relative" }}
      >
        <FlatList
          contentContainerClassName="grow px-4 pt-2 pb-14"
          data={messages}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState onSelectSuggestion={handleSuggestionPress} />
          }
          ListFooterComponent={loading ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToEnd}
          ref={listRef}
          renderItem={({ item }) => {
            if (item.role === "assistant" && item.kind === "stream") {
              return (
                <StreamMessageBubble
                  message={item}
                  onPrepare={setPrepareRecipe}
                  onSave={setSaveRecipe}
                />
              );
            }

            if (item.role === "assistant" && item.kind === "recipe") {
              return (
                <RecipeMessageBubble
                  message={item}
                  onPrepare={setPrepareRecipe}
                  onSave={setSaveRecipe}
                />
              );
            }

            return <MessageBubble message={item} onRetry={handleRetry} />;
          }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />

        <View className="absolute right-0 bottom-0 left-0 px-4 pb-2">
          <Surface
            className="flex-row items-center gap-1 overflow-hidden rounded-full"
            style={{
              backgroundColor: theme.colors.secondaryContainer,
              padding: 4,
              paddingLeft: 12,
            }}
          >
            <TextInput
              className="m-0 flex-1 p-0"
              onChangeText={setInput}
              placeholder={t("chat.messagePlaceholder")}
              placeholderTextColor={theme.colors.outline}
              style={{ color: theme.colors.onBackground }}
              value={input}
            />
            <IconButton
              containerColor={theme.colors.primary}
              icon={"send"}
              iconColor={theme.colors.onPrimary}
              onPress={handleSend}
              style={{ margin: 0 }}
            />
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
