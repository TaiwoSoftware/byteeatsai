import { useEffect, useRef, useState } from "react";
import ChatbotForm from "./ChatbotForm";
import ChatMessage from "./ChatMessage";

export type ChatMessageType = {
  role: "user" | "bot";
  text: string;
};

const ChatbotAI: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const generateBotResponse = async (
    history: ChatMessageType[]
  ): Promise<void> => {
    setChatHistory((prev) => [...prev, { role: "bot", text: "Thinking..." }]);

    const payload = history.map(({ role, text }) => ({
      role: role === "bot" ? "model" : "user",
      parts: [{ text }],
    }));

    try {
      const proxyApiUrl = import.meta.env.VITE_API_URL as string | undefined;
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as
        | string
        | undefined;
      const apiUrl =
        proxyApiUrl ||
        (geminiApiKey
          ? `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`
          : undefined);

      if (!apiUrl) {
        throw new Error(
          "Missing AI config. Add VITE_GEMINI_API_KEY or VITE_API_URL to your .env file."
        );
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: payload }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            `Chatbot request failed with status ${response.status}`
        );
      }

      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\n/g, "<br />")
          ?.trim() || "I couldn't understand that.";

      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "bot", text: botText },
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to get a chatbot response.";

      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "bot", text: `Oops! ${errorMessage}` },
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-2xl text-white shadow-lg transition hover:bg-orange-700"
        aria-label="Open AI assistant"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[70vh] w-full flex-col rounded-t-2xl border-t bg-white shadow-2xl sm:w-96 sm:rounded-lg sm:border">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-xl text-gray-500 hover:text-gray-700"
              aria-label="Close AI assistant"
            >
              x
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
            {chatHistory.length === 0 && (
              <div className="mt-10 text-center text-sm text-gray-400">
                <p>No messages yet</p>
                <p>Start typing below</p>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 z-10 border-t bg-white p-4">
            <ChatbotForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotAI;
