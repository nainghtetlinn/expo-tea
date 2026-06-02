import { z } from "zod";
import type { TeaIngredients } from "@/types/tea";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const chatResponseSchema = z.object({
  recipe: z.object({
    tea: z.number(),
    condensedMilk: z.number(),
    evaporatedMilk: z.number(),
    milk: z.number(),
  }),
});

export type ChatResponse = {
  recipe: TeaIngredients;
};

export async function sendChatPreferences(
  preferences: string,
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  const json: unknown = await response.json();
  const parsed = chatResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("Invalid recipe response");
  }

  return parsed.data;
}
