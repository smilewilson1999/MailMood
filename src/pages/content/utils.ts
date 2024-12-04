import { MESSAGES } from "@/constants";

export interface MessageResponse<D = unknown> {
  success: boolean;
  data?: D;
  error?: Error;
}

type MessageCallback<D = unknown> = (response: MessageResponse<D>) => void;

export const sendMessageToBackground = <D>(
  type: MESSAGES,
  data?: any,
  cb?: MessageCallback<D>
): Promise<MessageResponse<D>> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type, data },
      (response: MessageResponse<D>) => {
        // Handle callback if provided
        if (cb) {
          cb(response);
        }
        // Resolve the promise
        resolve(
          response || {
            success: false,
            error: new Error("No response from background"),
          }
        );
      }
    );
  });
};
