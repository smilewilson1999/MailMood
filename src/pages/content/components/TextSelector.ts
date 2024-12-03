import debounce from "lodash/debounce";

export class TextSelector {
  private lastSelectedText: string = "";
  private callback: (selectedText: string) => void;
  private readonly debounceTime: number;

  constructor(callback: (selectedText: string) => void, debounceTime = 250) {
    this.callback = callback;
    this.debounceTime = debounceTime;
    this.handleSelection = debounce(
      this.handleSelection.bind(this),
      this.debounceTime
    );
  }

  private cleanSelectedText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, " ") // normalize whitespace
      .replace(/[\u200B-\u200D\uFEFF]/g, ""); // remove zero-width spaces
  }

  private getSelectionFromIframes(): string {
    const iframes = Array.from(document.getElementsByTagName("iframe"));

    return iframes.reduce((selectedText, iframe) => {
      if (selectedText) return selectedText;

      try {
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow?.document) return "";

        return iframeWindow.getSelection()?.toString() || "";
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "SecurityError")) {
          console.error("Unexpected error accessing iframe content:", e);
        }
        return "";
      }
    }, "");
  }

  private handleSelection(): void {
    const mainSelection = window.getSelection()?.toString() || "";
    const iframeSelection = !mainSelection
      ? this.getSelectionFromIframes()
      : "";
    const selectedText = this.cleanSelectedText(
      mainSelection || iframeSelection
    );

    if (selectedText) {
      this.lastSelectedText = selectedText;
      this.callback(selectedText);
    }
  }

  public attach(): void {
    document.addEventListener("mouseup", this.handleSelection);
  }

  public detach(): void {
    document.removeEventListener("mouseup", this.handleSelection);
  }

  public reset(): void {
    this.lastSelectedText = "";
  }
}
