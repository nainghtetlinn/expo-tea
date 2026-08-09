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

const chatStreamResponseSchema = z.object({
  tea: z.number(),
  condensedMilk: z.number(),
  evaporatedMilk: z.number(),
  milk: z.number(),
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

export type StreamChatResult = {
  text: string;
  recipe: TeaIngredients;
};

/**
 * Streams chat preferences to the /chat-stream endpoint.
 * Calls `onChunk` with the accumulated text as each chunk arrives.
 * Returns the full text and parsed recipe once the stream completes.
 */
export async function streamChatPreferences(
  preferences: string,
  onChunk: (accumulatedText: string) => void,
  signal?: AbortSignal,
): Promise<StreamChatResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/chat-stream`);
    xhr.setRequestHeader("Content-Type", "application/json");
    // Tell intermediaries not to buffer, even if the server says text/plain
    xhr.setRequestHeader("Accept", "text/event-stream, text/plain");

    // Handle the AbortSignal manually since XHR doesn't accept it in the constructor
    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new DOMException("Aborted", "AbortError"));
      });
    }

    let seenTextLength = 0;
    let accumulated = "";

    xhr.onreadystatechange = () => {
      // readyState 3 = LOADING (receiving data), 4 = DONE
      if (xhr.readyState === 3 || xhr.readyState === 4) {
        const currentText = xhr.responseText || "";

        // Extract only the new chunk we haven't seen yet
        const newChunk = currentText.substring(seenTextLength);

        if (newChunk.length > 0) {
          accumulated += newChunk;
          seenTextLength = currentText.length;

          // Trigger your UI update
          // console.log(newChunk);
          onChunk(accumulated);
        }
      }

      // When the request is completely finished
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Extract the JSON recipe block from the end of the response
          const recipe = extractRecipeFromText(accumulated);
          const text = accumulated
            .replace(/```json\s*[\s\S]*?```\s*$/, "")
            .trimEnd();

          resolve({ text, recipe });
        } else {
          reject(new Error(`Stream request failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during streaming"));
    };

    // Start the request
    xhr.send(JSON.stringify({ preferences }));
  });
}

/**
 * Extracts and parses the ```json ... ``` block from the end of streamed text.
 */
function extractRecipeFromText(text: string): TeaIngredients {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```\s*$/);
  if (!jsonMatch?.[1]) {
    throw new Error("No recipe JSON block found in response");
  }

  const parsed = chatStreamResponseSchema.safeParse(JSON.parse(jsonMatch[1]));
  if (!parsed.success) {
    throw new Error("Invalid recipe JSON in stream response");
  }

  return parsed.data;
}
