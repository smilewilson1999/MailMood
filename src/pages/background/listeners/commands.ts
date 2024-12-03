import { MESSAGES } from "@/constants";
import { sendMessageToContent } from "../utils";
import { backgroundState } from "../states";
import { questionStorage } from "../modules/question-storage";
import { submitQuery } from "../modules/core";

export function setupCommandListeners() {
  chrome.commands.onCommand.addListener(handleCommand);
}

function handleCommand(command: string) {
  switch (command) {
    case "toggle_display":
      handleToggleDisplay();
      break;
    case "submit_text":
      handleSubmitText();
      break;
    case "clear_context":
      handleClearContext();
      break;
  }
}

/**
 * Toggle the display visibility
 */
function handleToggleDisplay() {
  sendMessageToContent(MESSAGES.TOGGLE_DISPLAY);
}

/**
 * Submit the text to the AI
 */
async function handleSubmitText() {
  try {
    const state = backgroundState.getState();
    if (state.queryStatus === "processing") return;

    backgroundState.setState({ queryStatus: "processing" });
    sendMessageToContent(MESSAGES.QUERY_STATUS, { status: "processing" });

    const response = await submitQuery();
    console.log("Response", response);

    backgroundState.setState({ queryStatus: "done" });
    sendMessageToContent(MESSAGES.QUERY_STATUS, {
      status: "done",
      emotions: response.emotions,
    });
    console.log("finished");
  } catch (error) {
    sendMessageToContent(MESSAGES.QUERY_STATUS, {
      status: "error",
      error,
    });
  }
}

/**
 * Clear the context
 */
async function handleClearContext() {
  try {
    // clear from storage
    await questionStorage.clearSelectedText();

    // update query status
    backgroundState.setState({ queryStatus: "ready" });
    sendMessageToContent(MESSAGES.QUERY_STATUS, { status: "ready" });
  } catch (error) {
    console.error(error);
  }
}
