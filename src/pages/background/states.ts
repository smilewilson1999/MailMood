export type QueryStatus =
  | "ready"
  | "text_loaded"
  | "processing"
  | "done"
  | "error";

export interface BackgroundState {
  queryStatus: QueryStatus;
}

/**
 * The state only exists temporarily in memory. It'll not persist when the extension is reloaded.
 */
class StateManager {
  private state: BackgroundState = {
    queryStatus: "ready",
  };

  private listeners: Set<(state: BackgroundState) => void> = new Set();

  getState(): BackgroundState {
    return { ...this.state };
  }

  setState(updates: Partial<BackgroundState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }
}

export const backgroundState = new StateManager();
