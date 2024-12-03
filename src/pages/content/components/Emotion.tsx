import { QueryStatus } from "@/pages/background/states";
import { DisplayStyle } from "@/types/customization-config";
import { EmotionResult } from "@/types/hume";

interface EmotionProps {
  status: QueryStatus;
  /**
   * The number of context counts (how many times the user inputted)
   */
  emotionResult: EmotionResult[];
  error?: string;
  style: DisplayStyle;
  isVisible: boolean;
}

export default function Emotion({
  status,
  emotionResult,
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

  const renderDisplay = () => {
    switch (status) {
      case "ready":
        return <div>Ready</div>;
      case "text_loaded":
        return <div>Receive</div>;
      case "processing":
        return <div>Processing</div>;
      case "done":
        return (
          <div>
            {emotionResult && emotionResult.length > 0 ? (
              <ul>
                {emotionResult.map((emotion, index) => (
                  <li key={index}>
                    {emotion.name}: {emotion.score.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              "Ready"
            )}
          </div>
        );
      case "error":
        console.error(error);
        return <div>{error || "Error"}</div>;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed p-1 font-serif"
      style={{
        ...getPosition(),
        zIndex: 100000,
        borderRadius: "4px",
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        fontSize: style.fontSize,
        border: `${style.borderWidth} solid ${style.borderColor}`,
        opacity: style.opacity,
      }}
    >
      {renderDisplay()}
    </div>
  );
}
