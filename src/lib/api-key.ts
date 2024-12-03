const STORAGE_KEY = "mailmood_api_key";

export async function getApiKey(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || "");
    });
  });
}

export async function setApiKey(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: apiKey }, () => {
      resolve();
    });
  });
}
