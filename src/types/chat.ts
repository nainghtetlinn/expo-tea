import type { TeaIngredients } from "@/types/tea";

export type ChatUserMessage = {
  id: string;
  role: "user";
  text: string;
};

export type ChatAssistantTextMessage = {
  id: string;
  role: "assistant";
  kind: "text";
  text: string;
};

export type ChatAssistantRecipeMessage = {
  id: string;
  role: "assistant";
  kind: "recipe";
  recipe: TeaIngredients;
};

export type ChatAssistantStreamMessage = {
  id: string;
  role: "assistant";
  kind: "stream";
  text: string;
  recipe?: TeaIngredients;
  streaming: boolean;
};

export type ChatAssistantErrorMessage = {
  id: string;
  role: "assistant";
  kind: "error";
  text: string;
  preferences: string;
};

export type ChatMessage =
  | ChatUserMessage
  | ChatAssistantTextMessage
  | ChatAssistantRecipeMessage
  | ChatAssistantStreamMessage
  | ChatAssistantErrorMessage;
