import { useState, useEffect } from "react";
import {
  getHumeApiKey,
  setHumeApiKey,
  getGeminiApiKey,
  setGeminiApiKey,
} from "@/lib/api-key";

export function ApiSettings() {
  const [humeApiKey, setHumeApiKeyState] = useState("");
  const [geminiApiKey, setGeminiApiKeyState] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    getHumeApiKey().then((key) => {
      if (key) {
        setHumeApiKeyState(key);
      }
    });
    getGeminiApiKey().then((key) => {
      if (key) {
        setGeminiApiKeyState(key);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      await Promise.all([
        setHumeApiKey(humeApiKey),
        setGeminiApiKey(geminiApiKey),
      ]);
      setSaveStatus("API keys saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("Failed to save API keys");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Hume AI Settings</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Configure your Hume AI API access for emotion detection
          </p>
          <input
            type="password"
            value={humeApiKey}
            onChange={(e) => setHumeApiKeyState(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your Hume AI API key"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Gemini Nano Settings</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Configure your Gemini Nano API access for contextual analysis
          </p>
          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKeyState(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your Gemini Nano API key"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Save API Keys
      </button>

      {saveStatus && (
        <p className="text-sm text-muted-foreground mt-2">{saveStatus}</p>
      )}
    </div>
  );
}
