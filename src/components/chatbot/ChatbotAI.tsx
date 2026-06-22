import { useState } from "react";
import { getGuideResponse } from "../TourGuide/getGuideResponse";

const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

const GuideChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I can guide you on how to use the website. Ask me anything!",
    },
  ]);

  // ✨ typing effect helper
  const typeText = async (text: string) => {
    let output = "";

    for (let i = 0; i < text.length; i++) {
      output += text[i];

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: output,
        };
        return updated;
      });

      await delay(10); // typing speed
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };

    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    // 🧠 fake AI thinking delay
    await delay(800);

    // get response
    const response = await getGuideResponse(input);

    // add empty bot message first (for typing effect)
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "" },
    ]);

    await typeText(response);

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-[70vh] bg-white shadow-2xl border flex flex-col">

          {/* Header */}
          <div className="p-4 bg-orange-600 text-white flex justify-between">
            <h2>Guide Assistant</h2>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-orange-600 text-white ml-auto w-fit"
                    : "bg-white border w-fit"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* typing indicator */}
            {loading && (
              <div className="text-sm text-gray-400 animate-pulse">
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask how to order food..."
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              disabled={loading}
              className="bg-orange-600 text-white px-4 rounded"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default GuideChatbot;