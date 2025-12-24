import { useRef, useState } from "react";

export type Chat = {
  role: "user" | "bot" | "model";
  text: string;
};

type Props = {
  chatHistory: Chat[];
  setChatHistory: React.Dispatch<React.SetStateAction<Chat[]>>;
  generateBotResponse: (history: Chat[]) => Promise<void>;
};

const ChatbotForm = ({ chatHistory, setChatHistory, generateBotResponse }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    const updatedHistory: Chat[] = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];

    setChatHistory(prev => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    await generateBotResponse(updatedHistory);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-gray-100 p-3 rounded-2xl shadow-sm"
    >
      <input
        type="text"
        value={input}
        ref={inputRef}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1"
      >
        <span>Send</span>
        <span>🚀</span>
      </button>
    </form>
  );
};

export default ChatbotForm;
