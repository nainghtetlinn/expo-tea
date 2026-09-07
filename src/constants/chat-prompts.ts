export const CHAT_PROMPTS = [
  "Suprise me",
  "I want strong and milky tea",
  "I want a less sweet tea",
  "Make me a light and creamy tea",
  "I want tea with no milk",
  "Give me a balanced classic milk tea",
  "I want extra strong tea flavor",
  "Recommend something smooth and sweet",
] as const;

export function pickRandomChatPrompts(count: number): string[] {
  const prompts = [...CHAT_PROMPTS];

  for (let i = prompts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
  }

  return prompts.slice(0, Math.min(count, prompts.length));
}
