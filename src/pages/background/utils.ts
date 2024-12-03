import { MESSAGES } from "@/constants";
import type { EmotionResult } from "@/types/hume";
import { QueryStatus } from "@/pages/background/states";

export interface QueryStatusUpdate {
  status: QueryStatus;
  emotions?: EmotionResult[];
  error?: string;
}

let isCapturing = false;

export const sendMessageToContent = (type: MESSAGES, data?: unknown) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab?.id) {
      chrome.tabs
        .sendMessage(activeTab.id, {
          type,
          data,
        })
        .catch((error) => {
          console.error("Error sending message to content script:", error);
        });
    }
  });
};

export function updateQueryStatus(update: QueryStatusUpdate) {
  sendMessageToContent(MESSAGES.QUERY_STATUS, update);
}

export function toggleCapture(tabId: number) {
  isCapturing = !isCapturing;

  if (isCapturing) {
    chrome.action.setBadgeText({ text: "R" });
    chrome.action.setBadgeBackgroundColor({ color: "#F1EFE5" });

    chrome.tabs.sendMessage(tabId, { action: "checkInjected" }, (response) => {
      if (chrome.runtime.lastError || !response || !response.injected) {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            files: ["contentScript.js"],
          },
          () => {
            chrome.tabs.sendMessage(tabId, { action: "startCapture" });
          }
        );
      } else {
        chrome.tabs.sendMessage(tabId, { action: "startCapture" });
      }
    });
  } else {
    chrome.action.setBadgeText({ text: "" });
    chrome.tabs.sendMessage(tabId, { action: "cancelCapture" });
  }
}
