import { MESSAGES } from "@/constants";
import { QueryStatus } from "@/pages/background/states";
import { CustomizationConfig } from "@/types/customization-config";
import { EmotionResult } from "@/types/hume";
import { EmailDraftResponse, EmotionContext } from "@/lib/gemini";

export type MessageHandler = (message: {
  type: MESSAGES;
  data: unknown;
}) => void;

export interface MessageHandlerProps {
  setIsDisplayVisible: (value: React.SetStateAction<boolean>) => void;
  setQueryStatus: React.Dispatch<React.SetStateAction<QueryStatus>>;
  setEmotionResult: React.Dispatch<React.SetStateAction<EmotionResult[]>>;
  setEmotionContext: React.Dispatch<React.SetStateAction<EmotionContext[]>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setConfig: (config: CustomizationConfig) => void;
}

export const createMessageHandler = (
  props: MessageHandlerProps
): MessageHandler => {
  const {
    setIsDisplayVisible,
    setQueryStatus,
    setEmotionResult,
    setEmotionContext,
    setError,
    setConfig,
  } = props;

  return (message: { type: MESSAGES; data: unknown }) => {
    console.log("Message received in content script:", message);
    switch (message.type) {
      case MESSAGES.TOGGLE_DISPLAY:
        setIsDisplayVisible((prev) => !prev);
        break;
      case MESSAGES.QUERY_STATUS: {
        const { status, emotions, context, error } = message.data as {
          status: QueryStatus;
          emotions: EmotionResult[];
          context: EmotionContext[];
          error?: string;
        };
        console.log("Query status", status, emotions, context, error);
        setQueryStatus(status);
        setEmotionResult(emotions);
        setEmotionContext(context || []);
        setError(error);
        break;
      }
      case MESSAGES.CONFIG_UPDATED:
        setConfig(message.data as CustomizationConfig);
        break;
      default:
        break;
    }
  };
};
