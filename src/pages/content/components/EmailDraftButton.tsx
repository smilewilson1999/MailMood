import { useState } from "react";
import { Mail } from "lucide-react";
import { EmailDraftResponse } from "@/lib/gemini";
import { sendMessageToBackground } from "../utils";
import { MESSAGES } from "@/constants";
import EmailDraft from "./EmailDraft";
import { EmotionResult } from "@/types/hume";
import { EmotionContext } from "@/lib/gemini";

interface EmailDraftButtonProps {
  emotionResult: EmotionResult[];
  emotionContext: EmotionContext[];
  className?: string;
}

export default function EmailDraftButton({
  emotionResult,
  emotionContext,
  className,
}: EmailDraftButtonProps) {
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [emailDraft, setEmailDraft] = useState<EmailDraftResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDraft = async () => {
    try {
      setIsGeneratingDraft(true);
      const { success, data, error } =
        await sendMessageToBackground<EmailDraftResponse>(
          MESSAGES.GENERATE_EMAIL_DRAFT
        );

      if (success && data) {
        setEmailDraft(data);
      } else if (error) {
        setError(error.message || "Failed to generate draft");
        console.error("Failed to generate draft:", error);
      }
    } catch (error) {
      console.error("Failed to generate email draft:", error);
      setError((error as Error).message || "Failed to generate draft");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  if (!emotionResult.length || !emotionContext.length) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleGenerateDraft}
        disabled={isGeneratingDraft}
        className={`p-3 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD1D1] transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg
          transform hover:-translate-y-0.5 border-2 border-[#F2B8B8] ${className}`}
        title="Generate Email Draft"
      >
        <Mail
          className={`w-6 h-6 text-[#FF6B6B] 
            ${isGeneratingDraft ? "animate-bounce" : "animate-none"}`}
        />
      </button>

      {emailDraft && (
        <EmailDraft
          subject={emailDraft.subject}
          body={emailDraft.body}
          onClose={() => setEmailDraft(null)}
        />
      )}

      {error && (
        <div className="text-[#FF6B6B] mt-2 p-3 bg-[#FFE5E5] rounded-xl border-2 border-[#F2B8B8] font-['Comic_Sans_MS']">
          {error}
        </div>
      )}
    </>
  );
}
