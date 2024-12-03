import { createRoot } from "react-dom/client";
import "@/global.css";
import Popup from "./Popup";

function init() {
  const rootContainer = document.getElementById("__root");
  if (!rootContainer) {
    throw new Error("Can't find Popup root element");
  }
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();
