import { createRoot } from "react-dom/client";
import Content from "./components/Content";
import styles from "./style.css?inline"; // Import CSS as string

// Create a wrapper div
const wrapper = document.createElement("div");
wrapper.id = "__root_swipr_wrapper";

// Create shadow DOM
const shadow = wrapper.attachShadow({ mode: "open" });

// Create root element inside shadow DOM
const root = document.createElement("div");
root.id = "__root_swipr";

// Create style element for Tailwind styles
const style = document.createElement("style");
style.textContent = styles;

// Append elements
shadow.appendChild(style);
shadow.appendChild(root);
document.body.appendChild(wrapper);

// Mount React
const reactRoot = createRoot(root);
reactRoot.render(<Content />);

try {
  console.log("MailMood injected");
} catch (e) {
  console.error(e);
}
