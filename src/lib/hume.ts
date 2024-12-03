import type { EmotionResult } from "@/constants";

interface HumeConfig {
  apiKey: string;
}

interface EmotionPrediction {
  emotions: Array<{
    name: string;
    score: number;
  }>;
}

interface HumeResponse {
  results: {
    predictions: Array<{
      models: {
        language: {
          groupedPredictions: Array<{
            predictions: EmotionPrediction[];
          }>;
        };
      };
    }>;
  };
}

export class HumeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HumeError";
  }
}

export class HumeClient {
  private apiKey: string;
  private baseUrl: string;

  constructor({ apiKey }: HumeConfig) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.hume.ai/v0/batch/jobs";
  }

  async analyzeText(text: string): Promise<EmotionResult[]> {
    try {
      const jobConfig = {
        text: [text],
        models: {
          language: {
            granularity: "sentence",
          },
        },
      };

      // Start job
      const jobResponse = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hume-Api-Key": this.apiKey,
        },
        body: JSON.stringify(jobConfig),
      });

      if (!jobResponse.ok) {
        throw new HumeError("Failed to start analysis job");
      }

      const { job_id } = await jobResponse.json();

      // Poll for results
      const results = await this.pollForResults(job_id);

      // Process and format results
      const predictions =
        results.results.predictions[0].models.language.groupedPredictions[0]
          .predictions;
      const overallEmotions: { [key: string]: number } = {};

      predictions.forEach((pred: EmotionPrediction) => {
        pred.emotions.forEach((emotion) => {
          if (!overallEmotions[emotion.name]) {
            overallEmotions[emotion.name] = 0;
          }
          overallEmotions[emotion.name] += emotion.score;
        });
      });

      // Return top 3 emotions
      return Object.entries(overallEmotions)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .slice(0, 3)
        .map(([name, score]) => ({
          name,
          score: Math.round(score * 100),
        }));
    } catch (error) {
      console.error("Hume analysis error:", error);
      throw error instanceof HumeError
        ? error
        : new HumeError("Failed to analyze text");
    }
  }

  private async pollForResults(jobId: string): Promise<HumeResponse> {
    const maxAttempts = 20;
    const pollInterval = 1000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`${this.baseUrl}/${jobId}`, {
        headers: {
          "X-Hume-Api-Key": this.apiKey,
        },
      });

      if (!response.ok) {
        throw new HumeError("Failed to get job results");
      }

      const data = await response.json();
      if (data.status === "completed") {
        return data;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new HumeError("Job timed out");
  }
}
