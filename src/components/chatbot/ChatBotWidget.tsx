import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchTopic } from "./Matchintent";
import { fallbackAnswer, suggestedQuestions } from "./ChatbotKnowledge";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
  link?: string;
  linkLabel?: string;
}

let messageId = 0;
const nextId = () => ++messageId;

const WELCOME_MESSAGE: ChatMessage = {
  id: nextId(),
  sender: "bot",
  text:
    "Hey there! 👋 I'm the ByteEats assistant. Ask me how to do something on the site — like tracking an order or setting up your shop.",
};

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const respondTo = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const userMessage: ChatMessage = { id: nextId(), sender: "user", text };

    const topic = matchTopic(text);
    const botMessage: ChatMessage = topic
      ? {
          id: nextId(),
          sender: "bot",
          text: topic.answer,
          link: topic.link,
          linkLabel: topic.linkLabel,
        }
      : { id: nextId(), sender: "bot", text: fallbackAnswer };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    respondTo(input);
  };

  const handleLinkClick = (link: string) => {
    setOpen(false);
    navigate(link);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="
            fixed z-50 bg-white shadow-2xl flex flex-col
            bottom-0 right-0 w-full h-full
            sm:bottom-24 sm:right-6 sm:w-96 sm:h-[32rem] sm:rounded-2xl
          "
        >
          {/* Header */}
          <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between sm:rounded-t-2xl">
            <div>
              <p className="font-semibold text-orange-500">ByteEats Assistant</p>
              <p className="text-xs text-gray-400">Here to help you use the site</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed
                    ${msg.sender === "user"
                      ? "bg-orange-700 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}
                  `}
                >
                  <p>{msg.text}</p>

                  {msg.link && msg.linkLabel && (
                    <button
                      onClick={() => handleLinkClick(msg.link!)}
                      className="mt-2 inline-block text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition"
                    >
                      {msg.linkLabel} →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Suggested questions, only shown before the user has said anything */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => respondTo(q)}
                    className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-orange-400 hover:text-orange-700 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white sm:rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the site..."
              className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-orange-700 hover:bg-orange-800 disabled:opacity-40 disabled:hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-full transition flex-shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="
          fixed z-50 bottom-6 right-6
          w-14 h-14 rounded-full shadow-lg
          bg-orange-700 hover:bg-orange-800 text-white
          flex items-center justify-center text-2xl
          transition transform hover:scale-105
        "
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatbotWidget;