type Chat = {
  role: "user" | "bot";
  text: string;
};

type Props = {
  chat: Chat;
};

const ChatMessage = ({ chat }: Props) => {
  const isUser = chat.role === "user";


  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm break-words text-sm
          ${
            isUser
              ? "bg-orange-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
      >
        {!isUser && <span className="mr-2">🤖</span>}
        <span dangerouslySetInnerHTML={{ __html: chat.text }} />
      </div>
    </div>
  );
};

export default ChatMessage;
