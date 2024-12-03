import { createRoot } from "react-dom/client";
import "@/global.css";
import Options from "./Options";

function init() {
  const rootContainer = document.getElementById("__root");
  if (!rootContainer) {
    throw new Error("Can't find Options root element");
  }
  const root = createRoot(rootContainer);
  root.render(<Options />);
}

init();
