import axios from "axios";
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
  const { data } = await axios.post(`${API_URL}/chat`, { preferences });

  const parsed = chatResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid recipe response");
  }

  return parsed.data;
}
