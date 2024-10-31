import { type Hume, HumeClient } from "hume";

console.log("Content script loaded");

function getApiKey(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiKey"], (result) => {
      resolve(result.apiKey || "");
    });
  });
}

function getSelectedText(): string {
  const selectedText = window.getSelection()?.toString().trim() || "";
  console.log("Selected text:", selectedText);
  return selectedText;
}

async function analyzeEmotions(text: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) {
      console.error("API key not found. Please set it in the extension options.");
      return ["Error: API key not found"];
    }

    const humeClient = new HumeClient({ apiKey });

    const jobConfig: Hume.expressionMeasurement.InferenceBaseRequest = {
      text: [text],
      models: { language: {} },
    };

    const job = await humeClient.expressionMeasurement.batch.startInferenceJob(jobConfig);
    await job.awaitCompletion();
    const results = await humeClient.expressionMeasurement.batch.getJobPredictions(job.jobId);

    if (!results || results.length === 0 || !results[0].results || !results[0].results.predictions) {
      throw new Error("Unexpected API response structure");
    }

    const predictions = results[0].results.predictions[0].models.language.groupedPredictions[0].predictions;

    // Calculate overall emotion scores
    const overallEmotions: { [key: string]: number } = {};
    predictions.forEach((pred: any) => {
      pred.emotions.forEach((emotion: any) => {
        if (!overallEmotions[emotion.name]) {
          overallEmotions[emotion.name] = 0;
        }
        overallEmotions[emotion.name] += emotion.score;
      });
    });

    console.log("Overall emotions before sorting:", overallEmotions);

    // Sort and format the top 3 emotions
    const sortedEmotions = Object.entries(overallEmotions)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([name, score]) => {
        console.log(`Processing emotion: ${name}, score: ${score}`);
        return {
          name,
          score: Number(score).toFixed(2),
        };
      });

    return sortedEmotions;
  } catch (error) {
    console.error("Error analyzing emotions:", error);
    return [`Error: ${(error as Error).message}`];
  }
}

function addMessageListener() {
  chrome.runtime.onMessage.addListener(
    (
      request: { action: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: { result: any }) => void,
    ) => {
      if (request.action === "detect_emotions") {
        const selectedText = getSelectedText();
        if (selectedText) {
          analyzeEmotions(selectedText).then((results) => {
            if (Array.isArray(results) && results.length > 0 && typeof results[0] === "object") {
              sendResponse({ result: results });
            } else {
              sendResponse({
                result: "Error analyzing emotions. Check console for details.",
              });
            }
          });
        } else {
          sendResponse({
            result: "No text selected. Please select some text in the email.",
          });
        }
      }
      return true; // Keep the message channel open for asynchronous responses
    },
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addMessageListener);
} else {
  addMessageListener();
}
