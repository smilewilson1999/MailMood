export enum MESSAGES {
  // Query Status
  QUERY_STATUS = "query_status",

  // Display Visability
  TOGGLE_DISPLAY = "toggle_display",

  // Text Selection
  TEXT_SELECTED = "text_selected",
  ANALYZE_TEXT = "analyze_text",

  // Customization
  CONFIG_UPDATED = "config_updated",
  GET_CONFIG = "get_config",

  // Email Draft
  GENERATE_EMAIL_DRAFT = "generate_email_draft",
  EMAIL_DRAFT_GENERATED = "email_draft_generated",
}

export const LOCAL_STORAGE_KEYS = {
  SELECTED_TEXT: "mailmood_selected_text",
};
