/* eslint-disable @typescript-eslint/no-explicit-any */
import { MESSAGES } from "@/constants";
import { sendMessageToContent } from "../utils";
import { questionStorage } from "../modules/question-storage";
import { backgroundState, QueryStatus } from "../states";
import { ConfigManager } from "@/types/customization-config";

export function setupRuntimeListeners() {
  chrome.runtime.onMessage.addListener(handleRuntimeMessage);
}

type Response = {
  success: boolean;
  data: unknown;
  error?: Error;
};

type ResponseCallback = (response: Response) => void;

function handleRuntimeMessage(
  message: { type: MESSAGES; data?: any },
  sender: chrome.runtime.MessageSender,
  sendResponse: ResponseCallback
) {
  switch (message.type) {
    case MESSAGES.TEXT_SELECTED:
      handleTextSelected(message.data);
      break;
    case MESSAGES.QUERY_STATUS:
      handleGetQueryStatus(sendResponse);
      break;
    case MESSAGES.GET_CONFIG:
      handleGetConfig(sendResponse);
      break;
  }

  // sending asynchronous message :)
  return true;
}

async function handleTextSelected(data: string) {
  try {
    await questionStorage.saveSelectedText(data);

    // set the status state to loaded
    backgroundState.setState({ queryStatus: "text_loaded" });

    const statusData = {
      status: "text_loaded" as QueryStatus,
    };

    sendMessageToContent(MESSAGES.QUERY_STATUS, statusData);

    // request update on the count
  } catch (error) {
    console.error("Error handling text selected", error);
  }
}

async function handleGetQueryStatus(sendResponse: ResponseCallback) {
  try {
    const state = backgroundState.getState();
    const data = {
      status: state.queryStatus,
    };

    sendResponse({ success: true, data });
  } catch (error) {
    sendResponse({ success: false, data: null, error: error as Error });
  }
}

// Customization
async function handleGetConfig(sendResponse: ResponseCallback) {
  try {
    let config = await ConfigManager.getConfig();

    sendResponse({ success: true, data: config });
  } catch (error) {
    sendResponse({ success: false, data: null, error: error as Error });
  }
}
