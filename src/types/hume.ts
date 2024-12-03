export interface EmotionPrediction {
  name: string;
  score: number;
}

export interface HumeResponse {
  predictions: Array<{
    models: {
      language: {
        predictions: Array<{
          emotions: Array<{
            name: string;
            score: number;
          }>;
        }>;
      };
    };
  }>;
}

export interface ProcessedEmotions {
  emotions: EmotionPrediction[];
  error?: string;
}

export interface EmotionResult {
  name: string;
  score: number;
}
