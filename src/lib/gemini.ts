import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { EmotionResult } from "@/types/hume";

export interface GeminiConfig {
  apiKey: string;
  modelName?: string;
}

export interface EmotionContext {
  emotion: string;
  explanation: string;
  relevantText: string[];
}

export interface EmailDraftResponse {
  subject: string;
  body: string;
}

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor({ apiKey, modelName = "gemini-pro" }: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async explainEmotions(
    text: string,
    emotions: EmotionResult[]
  ): Promise<EmotionContext[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      const prompt = this.constructPrompt(text, emotions);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const response = result.response;
      const responseText = response.text();

      return this.parseResponse(responseText);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      throw error instanceof GeminiError
        ? error
        : new GeminiError(
            error instanceof Error
              ? error.message
              : "Failed to analyze emotional context"
          );
    }
  }

  private constructPrompt(text: string, emotions: EmotionResult[]): string {
    const emotionsDescription = emotions
      .map((e) => `${e.name} (${e.score}%)`)
      .join(", ");

    return `
    Analyze this text: "${text}"

    The text expresses these emotions with their intensity scores: ${emotionsDescription}

    For each emotion, identify and explain which specific parts of the text contribute to that emotion. Format your response as a JSON array with this structure for each emotion:
    [
    {
        "emotion": "emotion name",
        "explanation": "brief explanation of why this emotion is present",
        "relevantText": ["quote 1", "quote 2"]
    }
    ]

    Ensure you:
    1. Match the emotion names exactly as provided
    2. Include direct quotes from the text
    3. Provide concise explanations
    4. Return valid JSON only, no additional text`;
  }

  private parseResponse(response: string): EmotionContext[] {
    try {
      // Find the first '[' and last ']' to extract just the JSON array
      const startIndex = response.indexOf("[");
      const endIndex = response.lastIndexOf("]") + 1;
      const jsonString = response.slice(startIndex, endIndex);

      const parsedResponse = JSON.parse(jsonString) as EmotionContext[];
      return parsedResponse;
    } catch (error) {
      console.error("Parse error:", error);
      throw new GeminiError(
        "Failed to parse Gemini response into valid emotion contexts"
      );
    }
  }

  async generateEmailDraft(
    originalText: string,
    emotions: EmotionResult[],
    context: EmotionContext[]
  ): Promise<EmailDraftResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      const prompt = this.constructEmailPrompt(originalText, emotions, context);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const response = result.response;
      return this.parseEmailResponse(response.text());
    } catch (error) {
      throw new GeminiError(
        error instanceof Error
          ? error.message
          : "Failed to generate email draft"
      );
    }
  }

  private constructEmailPrompt(
    originalText: string,
    emotions: EmotionResult[],
    context: EmotionContext[]
  ): string {
    return `
    As an email communication expert, create a professional response to this email:

    Original Email:
    "${originalText}"

    Emotional Analysis:
    ${emotions.map((e) => `- ${e.name}: ${e.score}%`).join("\n")}

    Context:
    ${context.map((c) => `- ${c.emotion}: ${c.explanation}`).join("\n")}

    Generate a professional email response that:
    1. Acknowledges and appropriately addresses the detected emotions
    2. Maintains a professional and constructive tone
    3. Provides a clear and concise response
    4. Includes both a subject line and body

    Format the response as JSON:
    {
    "subject": "Reply: Subject line here",
    "body": "Email body here"
    }`;
  }

  private parseEmailResponse(response: string): EmailDraftResponse {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new GeminiError("Failed to parse email draft response");
    }
  }
}
