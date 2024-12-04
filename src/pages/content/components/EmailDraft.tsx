import { useState } from "react";

interface EmailDraftProps {
  subject: string;
  body: string;
  onClose: () => void;
}

export default function EmailDraft({
  subject,
  body,
  onClose,
}: EmailDraftProps) {
  const [editedSubject, setEditedSubject] = useState(subject);
  const [editedBody, setEditedBody] = useState(body);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    const emailText = `Subject: ${editedSubject}\n\n${editedBody}`;
    navigator.clipboard.writeText(emailText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <dialog
      className="fixed inset-0 flex items-center justify-center z-50"
      open
    >
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-[#FFFACD] rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto shadow-lg border-4 border-[#F2B8B8]">
        <h2 className="text-2xl font-bold mb-6 text-[#FF6B6B] text-center font-['Comic_Sans_MS']">
          Email Draft
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2 text-[#FF6B6B] font-['Comic_Sans_MS']">
              Subject
            </label>
            <input
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#F2B8B8] rounded-xl bg-white text-gray-800 focus:outline-none focus:border-[#FF6B6B] transition duration-200"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-[#FF6B6B] font-['Comic_Sans_MS']">
              Body
            </label>
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border-2 border-[#F2B8B8] rounded-xl bg-white text-gray-800 focus:outline-none focus:border-[#FF6B6B] transition duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#FFE5E5] text-[#FF6B6B] rounded-xl hover:bg-[#FFD1D1] transition duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#FF5252] transition duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
