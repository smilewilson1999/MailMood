const HUME_STORAGE_KEY = "mailmood_api_key";
const GEMINI_STORAGE_KEY = "mailmood_gemini_api_key";

export async function getHumeApiKey(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([HUME_STORAGE_KEY], (result) => {
      resolve(result[HUME_STORAGE_KEY] || "");
    });
  });
}

export async function setHumeApiKey(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [HUME_STORAGE_KEY]: apiKey }, () => {
      resolve();
    });
  });
}

export async function getGeminiApiKey(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([GEMINI_STORAGE_KEY], (result) => {
      resolve(result[GEMINI_STORAGE_KEY] || "");
    });
  });
}

export async function setGeminiApiKey(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [GEMINI_STORAGE_KEY]: apiKey }, () => {
      resolve();
    });
  });
}
