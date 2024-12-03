/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { sendMessageToBackground } from "../utils";
import { MESSAGES } from "@/constants";
import Emotion from "./Emotion";
import { createMessageHandler } from "../handlers/messageHandler";
import { TextSelector } from "./TextSelector";
import { QueryStatus } from "@/pages/background/states";
import {
  CustomizationConfig,
  DEFAULT_CONFIG,
} from "@/types/customization-config";
import "../style.css";
import { EmotionResult } from "@/types/hume";

export default function Content() {
  // Display States
  const [isDisplayVisible, setIsDisplayVisible] = useState(false);

  // Query States
  const [queryStatus, setQueryStatus] = useState<QueryStatus>("ready");
  const [emotionResult, setEmotionResult] = useState<EmotionResult[]>([]);
  const [error, setError] = useState<string>();

  // Customization
  const [config, setConfig] = useState<CustomizationConfig>(DEFAULT_CONFIG);

  const messageHandler = createMessageHandler({
    setIsDisplayVisible,
    setQueryStatus,
    setEmotionResult,
    setError,
    setConfig,
  });

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageHandler);

    // retrieve query status
    sendMessageToBackground<{ status: QueryStatus }>(
      MESSAGES.QUERY_STATUS,
      null,
      (response: any) => {
        if (response.success && response.data) {
          const { status } = response.data;
          setQueryStatus(status);
        }
      }
    );

    // get customization config
    sendMessageToBackground<CustomizationConfig>(
      MESSAGES.GET_CONFIG,
      null,
      (response) => {
        if (response.success && response.data) {
          setConfig(response.data);
        }
      }
    );

    const textSelector = new TextSelector((selectedText) => {
      sendMessageToBackground(MESSAGES.TEXT_SELECTED, selectedText);
    });

    // Attach the event listener
    textSelector.attach();

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler);
      textSelector.detach();
    };
  }, []);

  return (
    <>
      <Emotion
        status={queryStatus}
        emotionResult={emotionResult}
        error={error}
        style={config.displayStyle}
        isVisible={isDisplayVisible}
      />
    </>
  );
}
