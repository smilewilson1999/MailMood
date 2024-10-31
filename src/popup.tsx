import React, { useState } from "react";
import { createRoot } from "react-dom/client";

interface Emotion {
  name: string;
  score: string;
  segments: Array<{
    text: string;
    position: number;
  }>;
}

interface EmotionResponse {
  result: Emotion[] | string;
  error?: boolean;
}

const Popup: React.FC = () => {
  const [result, setResult] = useState<Emotion[] | string>([]);
  const [isLoading, setIsLoading] = useState(false);

  const detectEmotions = () => {
    setIsLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.id !== undefined) {
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            files: ["dist/content.js"],
          },
          () => {
            chrome.tabs.sendMessage(currentTab.id!, { action: "detect_emotions" }, (response: EmotionResponse) => {
              setIsLoading(false);
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                setResult(`Error: ${chrome.runtime.lastError.message}`);
              } else if (response?.result) {
                setResult(response.result);
              } else {
                setResult("Error: No response received");
              }
            });
          },
        );
      } else {
        setIsLoading(false);
        setResult("Error: Unable to get current tab ID");
      }
    });
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="logo128.png" alt="Email Emotion Detector" className="logo" />
      </div>
      <h1>MailMood</h1>
      <button type="button" onClick={detectEmotions} disabled={isLoading}>
        {isLoading ? "Detecting..." : "Detect Emotions"}
      </button>
      <p>Select text before clicking the button!</p>
      <div className="result-container">
        {Array.isArray(result) ? (
          <ul>
            {result.map((emotion) => (
              <li key={`${emotion.name}-${emotion.score}`}>
                <span className="emotion-name">{emotion.name}</span>
                <span className="emotion-score">{emotion.score}</span>
                {emotion.segments?.map((segment, idx) => (
                  <div key={`${emotion.name}-segment-${idx}`} className="emotion-text">
                    Text: "{segment.text}"
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p>{result}</p>
        )}
      </div>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<Popup />);
  } else {
    console.error("Root element not found");
  }
});

export default Popup;
