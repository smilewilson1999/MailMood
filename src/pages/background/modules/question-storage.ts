import { createStorage } from "@/lib/storage";
import { StorageEnum } from "@/lib/storage";
import { EmotionResult } from "@/types/hume";
import { EmotionContext } from "@/lib/gemini";

interface AnalyzedText {
  text: string;
  emotions: EmotionResult[];
  context: EmotionContext[];
}

class QuestionStorage {
  private textStorage = createStorage<string>("mailmood_text_selected", "", {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  });

  private analyzedTextStorage = createStorage<AnalyzedText | null>(
    "mailmood_analyzed_text",
    null,
    {
      storageEnum: StorageEnum.Local,
      liveUpdate: true,
    }
  );

  // Text Management
  async getSelectedText() {
    return this.textStorage.get();
  }

  async saveSelectedText(text: string) {
    const processedText = text.trim();
    if (!processedText) return null;

    const currentText = await this.getSelectedText();
    if (currentText === processedText) return null;

    const newText = `${currentText} ${processedText}`.trim();
    await this.textStorage.set(newText);
  }

  async clearSelectedText() {
    await this.textStorage.set("");
  }

  // Analyzed Text Management
  async saveAnalyzedText(
    text: string,
    emotions: EmotionResult[],
    context: EmotionContext[]
  ) {
    await this.analyzedTextStorage.set({ text, emotions, context });
  }

  async getAnalyzedText() {
    return this.analyzedTextStorage.get();
  }

  async clearAnalyzedText() {
    await this.analyzedTextStorage.set(null);
  }
}

const questionStorage = new QuestionStorage();
export { questionStorage };
