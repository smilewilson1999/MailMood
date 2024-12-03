import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Emotion {
  name: string;
  score: number;
}

interface EmotionOverlayProps {
  isVisible: boolean;
  emotions: Emotion[];
  status: "ready" | "processing" | "done" | "error";
}

export default function EmotionOverlay({
  isVisible,
  emotions,
  status,
}: EmotionOverlayProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (status === "done" && emotions.length) {
      setShouldShow(true);
      // Auto hide after 3 seconds
      const timer = setTimeout(() => setShouldShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, emotions]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100000]">
      {status === "ready" && <div className="text-xl">R</div>}
      {status === "processing" && <div className="text-xl">P</div>}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-lg p-4 max-w-sm"
          >
            <h3 className="text-lg font-bold mb-2">Email Emotions</h3>
            <div className="space-y-2">
              {emotions.map((emotion, i) => (
                <motion.div
                  key={emotion.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between"
                >
                  <span className="capitalize">{emotion.name}</span>
                  <span>{emotion.score}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
