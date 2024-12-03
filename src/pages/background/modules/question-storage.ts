import { createStorage } from "@/lib/storage";
import { StorageEnum } from "@/lib/storage";

class QuestionStorage {
  private textStorage = createStorage<string>("mailmood_text_selected", "", {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  });

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
}

const questionStorage = new QuestionStorage();
export { questionStorage };
