import { useState } from "react";
import { Send, Video } from "lucide-react";
import type { ChatListItem, ChatMessage } from "@/shared/types/chat";

interface Props {
  chat: ChatListItem;
  messages: ChatMessage[];
  sendMessage: (msg: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>; 
  onScrollTop: () => void;
}

const ChatWindow = ({ chat, messages, sendMessage, containerRef, onScrollTop }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-card">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
          {chat.partner.fname.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">{chat.partner.fname} {chat.partner.lname}</div>
          <div className="text-xs opacity-70">online</div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={onScrollTop}
        className="flex-1 overflow-y-auto thin-scrollbar bg-muted/10 dark:bg-muted/5 p-6 space-y-3"
      >

        {messages.map((msg) => {
          const isSelf = msg.senderId === chat.partner.id; 

          return (
            <div key={msg.id} className={`flex ${isSelf ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-sm px-4 py-2 rounded-2xl shadow-sm relative 
                  ${isSelf ? "bg-card border" : "bg-blue-600 text-white"}`}
              >
                <div>{msg.content}</div>
                <span className="absolute bottom-1 right-2 text-[10px] opacity-60">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card flex items-center gap-3">
        <input
          className="flex-1 px-4 py-2 rounded-lg bg-muted/40 outline-none"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          disabled={!text.trim()}
          onClick={handleSend}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <Send size={18} />
        </button>

        <button className="p-2 border rounded-lg">
          <Video size={20} />
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;
