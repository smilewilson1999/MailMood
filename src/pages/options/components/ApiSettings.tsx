import { useState, useEffect } from "react";
import { getApiKey, setApiKey } from "@/lib/api-key";

export function ApiSettings() {
  const [apiKey, setApiKeyState] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    getApiKey().then((key) => {
      if (key) {
        setApiKeyState(key);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      await setApiKey(apiKey);
      setSaveStatus("API key saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("Failed to save API key");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyState(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Configure your Hume AI API access
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your Hume AI API key"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Save API Key
        </button>

        {saveStatus && (
          <p className="text-sm text-muted-foreground">{saveStatus}</p>
        )}
      </div>
    </div>
  );
}
