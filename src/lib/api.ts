import { HumeClient } from "./hume";

// Initialize Hume client with API key
const humeClient = new HumeClient(import.meta.env.VITE_HUME_API_KEY);

export async function analyzeEmailEmotions(text: string) {
  return humeClient.analyzeText(text);
}
