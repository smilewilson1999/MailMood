import LOGO from "@/assets/mailmood-logo.png";

export default function Popup() {
  return (
    <div className="container">
      <div className="logo-container">
        <img src={LOGO} alt="Email Emotion Detector" className="logo" />
      </div>
      <h1>MailMood</h1>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => chrome.runtime.openOptionsPage()}
          className="w-full rounded-lg"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
