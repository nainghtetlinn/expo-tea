import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { pickRandomChatPrompts } from "@/constants/chat-prompts";
import type { ChatMessage } from "@/types/chat";
import type { TeaIngredients } from "@/types/tea";
import { TeaCup } from "../tea-cup";
import { MarkdownText } from "./markdown-text";

const BUBBLE_RADIUS = 18;
const BUBBLE_TAIL_RADIUS = 4;

export function TypingIndicator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mb-2 max-w-[85%] self-start">
      <Surface
        elevation={1}
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.surfaceVariant,
          borderBottomLeftRadius: BUBBLE_TAIL_RADIUS,
          borderRadius: BUBBLE_RADIUS,
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <ActivityIndicator size="small" />
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          {t("chat.thinking")}
        </Text>
      </Surface>
    </View>
  );
}

export function EmptyState({
  onSelectSuggestion,
}: {
  onSelectSuggestion: (prompt: string) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const randomPrompts = useMemo(() => pickRandomChatPrompts(3), []);

  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
      <Surface
        elevation={0}
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 999,
          height: 72,
          justifyContent: "center",
          width: 72,
        }}
      >
        <MaterialCommunityIcons
          color={theme.colors.onPrimaryContainer}
          name="tea"
          size={36}
        />
      </Surface>
      <Text style={{ textAlign: "center" }} variant="titleMedium">
        {t("chat.emptyTitle")}
      </Text>
      <Text
        style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}
        variant="bodyMedium"
      >
        {t("chat.emptyHint")}
      </Text>
      <View className="mt-2 w-full flex-row flex-wrap justify-center gap-2">
        {randomPrompts.map((prompt) => (
          <Button
            compact
            key={prompt}
            mode={"outlined"}
            onPress={() => onSelectSuggestion(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </View>
    </View>
  );
}

export function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry?: (messageId: string, preferences: string) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (message.role === "user") {
    return (
      <View className="mb-2 max-w-[85%] self-end">
        <Surface
          elevation={1}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderBottomRightRadius: BUBBLE_TAIL_RADIUS,
            borderRadius: BUBBLE_RADIUS,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{ color: theme.colors.onPrimaryContainer }}
            variant="bodyLarge"
          >
            {message.text}
          </Text>
        </Surface>
      </View>
    );
  }

  if (message.kind === "recipe") {
    return null;
  }

  const isError = message.kind === "error";

  return (
    <View className="mb-2 w-full max-w-[85%] self-start">
      <Surface
        elevation={1}
        style={{
          backgroundColor: isError
            ? theme.colors.errorContainer
            : theme.colors.surfaceVariant,
          borderBottomLeftRadius: BUBBLE_TAIL_RADIUS,
          borderRadius: BUBBLE_RADIUS,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <View className="flex-row items-center gap-1">
          <View style={{ flex: 1 }}>
            <MarkdownText
              color={
                isError
                  ? theme.colors.onErrorContainer
                  : theme.colors.onSurfaceVariant
              }
            >
              {message.text}
            </MarkdownText>
          </View>
          {isError && onRetry ? (
            <IconButton
              accessibilityLabel={t("chat.tryAgain")}
              icon="refresh"
              iconColor={theme.colors.onErrorContainer}
              onPress={() => onRetry(message.id, message.preferences)}
              size={18}
              style={{ margin: 0 }}
            />
          ) : null}
        </View>
      </Surface>
    </View>
  );
}

export function RecipeMessageBubble({
  message,
  onPrepare,
  onSave,
}: {
  message: Extract<ChatMessage, { kind: "recipe" }>;
  onPrepare: (recipe: TeaIngredients) => void;
  onSave: (recipe: TeaIngredients) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mb-2 w-full max-w-[92%] self-start">
      <Surface
        elevation={1}
        style={{
          backgroundColor: theme.colors.elevation.level2,
          borderBottomLeftRadius: BUBBLE_TAIL_RADIUS,
          borderRadius: BUBBLE_RADIUS,
          overflow: "hidden",
        }}
      >
        <View className="flex-row items-center gap-3 p-4">
          <TeaCup ingredients={message.recipe} totalHeight={56} />
          <Text variant="titleSmall">{t("chat.suggestedRecipe")}</Text>
        </View>
        <View className="px-4 pb-2">
          <RecipeIngredients ingredients={message.recipe} />
        </View>
        <Divider />
        <View className="flex-row gap-2 p-3">
          <Button
            icon="tea"
            mode="contained"
            onPress={() => onPrepare(message.recipe)}
            style={{ flex: 1 }}
          >
            {t("chat.prepare")}
          </Button>
          <Button
            icon="content-save"
            mode="contained-tonal"
            onPress={() => onSave(message.recipe)}
            style={{ flex: 1 }}
          >
            {t("chat.saveRecipe")}
          </Button>
        </View>
      </Surface>
    </View>
  );
}

function RecipeIngredients({ ingredients }: { ingredients: TeaIngredients }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View className="mt-2 flex-row flex-wrap gap-2">
      {Object.entries(ingredients)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => (
          <Surface
            key={key}
            mode="flat"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.roundness * 4,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text variant="labelSmall">{t(`ingredients.${key}`)}</Text>
            <Text variant="bodySmall">{value} ml</Text>
          </Surface>
        ))}
    </View>
  );
}

export function StreamMessageBubble({
  message,
  onPrepare,
  onSave,
}: {
  message: Extract<ChatMessage, { kind: "stream" }>;
  onPrepare: (recipe: TeaIngredients) => void;
  onSave: (recipe: TeaIngredients) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mb-2 w-full max-w-[92%] self-start">
      <Surface
        elevation={1}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderBottomLeftRadius: BUBBLE_TAIL_RADIUS,
          borderRadius: BUBBLE_RADIUS,
          overflow: "hidden",
        }}
      >
        {/* Streaming text */}
        <View style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
          <MarkdownText
            color={theme.colors.onSurfaceVariant}
            cursor={message.streaming}
          >
            {message.text}
          </MarkdownText>
        </View>

        {/* Recipe card — shown once streaming completes and recipe is available */}
        {!message.streaming && message.recipe ? (
          <>
            <Divider />
            <View className="flex-row items-center gap-3 p-4">
              <TeaCup ingredients={message.recipe} totalHeight={56} />
              <Text variant="titleSmall">{t("chat.suggestedRecipe")}</Text>
            </View>
            <View className="px-4 pb-2">
              <RecipeIngredients ingredients={message.recipe} />
            </View>
            <Divider />
            <View className="flex-row gap-2 p-3">
              <Button
                icon="tea"
                mode="contained"
                onPress={() => onPrepare(message.recipe!)}
                style={{ flex: 1 }}
              >
                {t("chat.prepare")}
              </Button>
              <Button
                icon="content-save"
                mode="contained-tonal"
                onPress={() => onSave(message.recipe!)}
                style={{ flex: 1 }}
              >
                {t("chat.saveRecipe")}
              </Button>
            </View>
          </>
        ) : null}
      </Surface>
    </View>
  );
}
