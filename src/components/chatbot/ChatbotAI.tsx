import { useState, useRef, useEffect } from "react";
import ChatbotForm from "./ChatbotForm";
import ChatMessage from "./ChatMessage";

const ChatbotAI = () => {
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const generateBotResponse = async (history) => {
    // Add "Thinking..." placeholder
    setChatHistory(prev => [...prev, { role: "model", text: "Thinking..." }]);

    const payload = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: payload }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      const botText = data.candidates[0].content.parts[0].text.replace(/\n/g, "<br />").trim();
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        { role: "model", text: botText }
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        { role: "model", text: "Oops! Something went wrong." }
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-orange-700 transition z-50"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 w-full sm:w-96 h-[70vh] bg-white shadow-2xl border-t sm:border rounded-t-2xl sm:rounded-lg flex flex-col z-50">
          
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-lg font-semibold text-gray-800">AI Assistant 🤖</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">
                <p>No messages yet</p>
                <p>Start typing below 👇</p>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white sticky bottom-0 z-10">
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
