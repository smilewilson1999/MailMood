import { QueryStatus } from "@/pages/background/states";
import { DisplayStyle } from "@/types/customization-config";
import { EmotionResult } from "@/types/hume";
import { EmailDraftResponse, EmotionContext, GeminiClient } from "@/lib/gemini";
import EmailDraftButton from "./EmailDraftButton";

interface EmotionProps {
  status: QueryStatus;
  /**
   * The number of context counts (how many times the user inputted)
   */
  emotionResult: EmotionResult[];
  emotionContext: EmotionContext[];
  error?: string;
  style: DisplayStyle;
  isVisible: boolean;
}

export default function Emotion({
  status,
  emotionResult,
  emotionContext,
  error,
  style,
  isVisible,
}: EmotionProps) {
  if (window.top !== window || !isVisible) return null;

  const getPosition = () => {
    const { placement, offset } = style;
    const positions: Record<string, React.CSSProperties> = {
      "bottom-right": { bottom: offset, right: offset },
    };
    return positions[placement];
  };

  const renderEmotions = () => {
    if (!emotionResult || emotionResult.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-[#FF6B6B] font-['Comic_Sans_MS']">
          Emotions Detected
        </h3>
        <ul className="space-y-2">
          {emotionResult.map((emotion, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white/80 p-3 rounded-xl 
                border-2 border-[#F2B8B8] hover:shadow-md transition-all duration-200"
            >
              <span className="capitalize font-medium text-[#FF6B6B] font-['Comic_Sans_MS']">
                {emotion.name}
              </span>
              <span className="text-[#FF8C00] font-bold font-['Comic_Sans_MS']">
                {emotion.score.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderContext = () => {
    if (!emotionContext || emotionContext.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-3 text-[#FF6B6B] font-['Comic_Sans_MS']">
          Emotional Context
        </h3>
        <div className="space-y-4">
          {emotionContext.map((context, index) => (
            <div
              key={index}
              className="bg-white/80 p-4 rounded-xl border-2 border-[#F2B8B8] 
                hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium capitalize text-[#FF6B6B] mb-2 font-['Comic_Sans_MS']">
                {context.emotion}
              </h4>
              <p className="text-gray-700 mb-2 font-['Comic_Sans_MS']">
                {context.explanation}
              </p>
              {context.relevantText.map((text, idx) => (
                <div
                  key={idx}
                  className="text-sm mt-2 italic text-gray-600 bg-[#FFE5E5] p-3 
                    rounded-lg border border-[#F2B8B8] font-['Comic_Sans_MS']"
                >
                  "{text}"
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDisplay = () => {
    switch (status) {
      case "ready":
        return (
          <div className="text-[#FF6B6B] font-['Comic_Sans_MS'] text-lg">
            Ready
          </div>
        );
      case "text_loaded":
        return (
          <div className="text-[#FF6B6B] font-['Comic_Sans_MS'] text-lg">
            Receive
          </div>
        );
      case "processing":
        return (
          <div className="text-[#FF6B6B] font-['Comic_Sans_MS'] text-lg animate-pulse">
            Processing...
          </div>
        );
      case "done":
        return (
          <div className="space-y-6">
            {renderEmotions()}
            {renderContext()}
          </div>
        );
      case "error":
        console.error(error);
        return (
          <div
            className="text-[#FF6B6B] font-['Comic_Sans_MS'] bg-[#FFE5E5] 
            p-3 rounded-xl border-2 border-[#F2B8B8]"
          >
            {error || "Error"}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed p-6 max-w-xl overflow-auto max-h-[90vh] rounded-3xl shadow-lg 
        bg-[#FFFACD] border-4 border-[#F2B8B8] transition-all duration-200"
      style={{
        ...getPosition(),
        zIndex: 100000,
      }}
    >
      {status === "done" && (
        <EmailDraftButton
          emotionResult={emotionResult}
          emotionContext={emotionContext}
          className="absolute top-4 right-4"
        />
      )}
      {renderDisplay()}
    </div>
  );
}
