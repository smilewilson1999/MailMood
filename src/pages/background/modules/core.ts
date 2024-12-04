import { questionStorage } from "./question-storage";
import { Hume, HumeClient, HumeError } from "hume";
import type { EmotionResult } from "@/types/hume";
import { getGeminiApiKey, getHumeApiKey } from "@/lib/api-key";
import { GeminiClient, EmotionContext, EmailDraftResponse } from "@/lib/gemini";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AIQueryErrorType = "AI_QUERY_ERROR" | "NO_API_KEY";

export class AIQueryError extends Error {
  type: AIQueryErrorType;
  message: string;

  constructor(type: AIQueryErrorType, message: string) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

export interface AIQueryResponse {
  emotions: EmotionResult[];
  context: EmotionContext[];
}

export async function submitQuery(): Promise<AIQueryResponse> {
  const apiKeyHume = await getHumeApiKey();
  const apiKeyGemini = await getGeminiApiKey();

  if (!apiKeyHume) {
    throw new AIQueryError("NO_API_KEY", "No Hume API key found");
  }

  if (!apiKeyGemini) {
    throw new AIQueryError("NO_API_KEY", "No Gemini API key found");
  }

  const selectedText = await questionStorage.getSelectedText();
  if (!selectedText) {
    throw new AIQueryError("AI_QUERY_ERROR", "No selected text found");
  }

  try {
    // Initialize clients
    const humeClient = new HumeClient({ apiKey: apiKeyHume });
    const geminiClient = new GeminiClient({ apiKey: apiKeyGemini });

    // Configure and submit Hume job
    const jobConfig: Hume.expressionMeasurement.InferenceBaseRequest = {
      text: [selectedText],
      models: { language: {} },
    };

    // Submit Hume Job
    const job = await humeClient.expressionMeasurement.batch.startInferenceJob(
      jobConfig
    );
    await job.awaitCompletion();

    // Get Hume predictions
    const results =
      await humeClient.expressionMeasurement.batch.getJobPredictions(job.jobId);

    // Calculate emotions
    const emotions = calculateTopEmotions(results);

    // Get Gemini context analysis
    const context = await geminiClient.explainEmotions(selectedText, emotions);

    // Save analyzed text and results before clearing
    await questionStorage.saveAnalyzedText(selectedText, emotions, context);

    // Clear stored data after successful query
    await questionStorage.clearSelectedText();

    return { emotions, context };
  } catch (error: any) {
    if (error instanceof HumeError) {
      throw new AIQueryError("AI_QUERY_ERROR", error.message);
    } else {
      throw new AIQueryError(
        "AI_QUERY_ERROR",
        error.message || "Unknown error"
      );
    }
  }
}

function calculateTopEmotions(results: any): EmotionResult[] {
  if (
    !results ||
    !results[0] ||
    !results[0].results ||
    !results[0].results.predictions ||
    !results[0].results.predictions[0] ||
    !results[0].results.predictions[0].models ||
    !results[0].results.predictions[0].models.language ||
    !results[0].results.predictions[0].models.language.groupedPredictions ||
    !results[0].results.predictions[0].models.language.groupedPredictions[0] ||
    !results[0].results.predictions[0].models.language.groupedPredictions[0]
      .predictions
  ) {
    throw new Error("Unexpected API response structure");
  }

  const predictions =
    results[0].results.predictions[0].models.language.groupedPredictions[0]
      .predictions;

  // Calculate overall emotion scores
  const overallEmotions: { [key: string]: number } = {};
  predictions.forEach((pred: any) => {
    if (pred.emotions) {
      pred.emotions.forEach((emotion: any) => {
        if (!overallEmotions[emotion.name]) {
          overallEmotions[emotion.name] = 0;
        }
        overallEmotions[emotion.name] += emotion.score;
      });
    }
  });

  // Sort and format the top 3 emotions
  const sortedEmotions = Object.entries(overallEmotions)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, 3)
    .map(([name, score]) => ({
      name,
      score: Number(score),
    }));

  return sortedEmotions;
}

/**
 * Generate an email draft based on the analyzed text
 * @returns EmailDraftResponse
 * @throws AIQueryError
 */
export async function generateEmailDraft(): Promise<EmailDraftResponse> {
  const [apiKey, analyzedText] = await Promise.all([
    getGeminiApiKey(),
    questionStorage.getAnalyzedText(),
  ]);

  if (!apiKey) {
    throw new AIQueryError("NO_API_KEY", "No Gemini API key found");
  }
  if (!analyzedText) {
    throw new AIQueryError("AI_QUERY_ERROR", "No analyzed text found");
  }

  const geminiClient = new GeminiClient({
    apiKey: apiKey,
  });

  try {
    return await geminiClient.generateEmailDraft(
      analyzedText.text,
      analyzedText.emotions,
      analyzedText.context
    );
  } catch (error: any) {
    throw new AIQueryError(
      "AI_QUERY_ERROR",
      error.message || "Failed to generate email draft"
    );
  }
}
