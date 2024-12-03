import { MESSAGES } from "@/constants";

type MessageCallback<D = unknown> = ({
  success,
  data,
  error,
}: {
  success: boolean;
  data: D;
  error: Error;
}) => any;

export const sendMessageToBackground = <D>(
  type: MESSAGES,
  data?: any,
  cb?: MessageCallback<D>
) => {
  chrome.runtime.sendMessage({ type, data }).then(cb);
};
