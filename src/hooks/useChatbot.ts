import { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! How can I help you?", sender: "bot" },
  ]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
      // Send request to Claude API
      const response = await fetch("https://api.anthropic.com/v1/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
        },
        body: JSON.stringify({
          model: "claude-2",
          prompt: buildPrompt(messages, message),
          max_tokens_to_sample: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data?.completion || "Sorry, I didn't understand that.";

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong.", sender: "bot" },
      ]);
    }
  };

  // Build conversation history
  const buildPrompt = (history: Message[], newMessage: string) => {
    const convo = history
      .map((msg) => (msg.sender === "user" ? `Human: ${msg.text}` : `Assistant: ${msg.text}`))
      .join("\n");
    return `${convo}\nHuman: ${newMessage}\nAssistant:`;
  };

  return { messages, sendMessage };
};

export default useChatbot;
