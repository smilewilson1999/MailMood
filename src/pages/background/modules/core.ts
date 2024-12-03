import { questionStorage } from "./question-storage";
import { Hume, HumeClient, HumeError } from "hume";
import type { EmotionResult } from "@/types/hume";
import { getApiKey } from "@/lib/api-key";

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
}

export async function submitQuery(): Promise<AIQueryResponse> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new AIQueryError("NO_API_KEY", "No Hume API key found");
  }
  const selectedText = await questionStorage.getSelectedText();
  if (!selectedText) {
    throw new AIQueryError("AI_QUERY_ERROR", "No selected text found");
  }

  try {
    const humeClient = new HumeClient({ apiKey });

    // Configure job
    const jobConfig: Hume.expressionMeasurement.InferenceBaseRequest = {
      text: [selectedText],
      models: { language: {} }, // Use default language model configuration
    };

    // Submit Job
    const job = await humeClient.expressionMeasurement.batch.startInferenceJob(
      jobConfig
    );

    // Await Job to complete
    await job.awaitCompletion();

    // Fetch Job predictions by Job ID
    const results =
      await humeClient.expressionMeasurement.batch.getJobPredictions(job.jobId);

    // Calculate top three emotions
    const emotions = calculateTopEmotions(results);

    // Clear the stored data after successful query
    await questionStorage.clearSelectedText();

    return { emotions };
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
