import { HumeClient } from "./hume";
import { GeminiClient } from "./gemini";
import { EmotionResult } from "@/types/hume";
import { EmotionContext } from "./gemini";

interface AnalysisResult {
  emotions: EmotionResult[];
  context: EmotionContext[];
}

// Initialize clients with API keys
const humeClient = new HumeClient(import.meta.env.VITE_HUME_API_KEY);
const geminiClient = new GeminiClient({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeEmailEmotions(
  text: string
): Promise<AnalysisResult> {
  // First get emotion scores from Hume
  const emotions = await humeClient.analyzeText(text);

  // Then get contextual analysis from Gemini
  const context = await geminiClient.explainEmotions(text, emotions);

  return {
    emotions,
    context,
  };
}
