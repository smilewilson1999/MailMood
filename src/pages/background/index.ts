import { setupCommandListeners, setupRuntimeListeners } from "./listeners";
import { questionStorage } from "./modules/question-storage";

// Debug logging
chrome.commands.onCommand.addListener((command) => {
  console.log("Command received:", command);
});

function initialize() {
  // Debug: list all commands
  chrome.commands.getAll((commands) => {
    console.log("Available commands:", commands);
  });

  // Setup listeners
  setupCommandListeners();
  setupRuntimeListeners();

  // clear the previous context, query status when the extension is loaded / reloaded
  questionStorage.clearSelectedText();

  console.log("MailMood background loaded");
}

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  initialize();
});

// Initialize install/update/reload
initialize();
