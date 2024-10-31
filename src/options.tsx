import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const Options = () => {
  const [apiKey, setApiKey] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["apiKey"], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    chrome.storage.sync.set({ apiKey }, () => {
      setSaveStatus("API key saved successfully! 🎉");
      setTimeout(() => setSaveStatus(""), 3000);
    });
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="logo128.png" alt="Email Emotion Detector" className="logo" />
      </div>
      <h1>MailMood Settings</h1>
      <div className="options-form">
        <div className="input-container">
          <label htmlFor="apiKey" className="input-label">
            Hume AI API Key:
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-input"
            placeholder="Enter your API key here"
          />
        </div>
        <button type="button" onClick={saveApiKey}>
          Save API Key
        </button>
        {saveStatus && (
          <div className="result-container">
            <p>{saveStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Options />
      </React.StrictMode>,
    );
  } else {
    console.error("Root element not found");
  }
});

export default Options;
