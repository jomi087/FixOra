import { Search } from "lucide-react";
import { toPascalCase } from "@/utils/helper/utils";
import type { ChatListItem } from "@/shared/types/chat";

interface Props {
  chats: ChatListItem[];
  selectedId?: string;
  onSelect: (chat: ChatListItem) => void;
  query: string;
  onQueryChange: (v: string) => void;
}

const ChatList = ({ chats, selectedId, onSelect, query, onQueryChange }: Props) => {
  return (
    <div className="h-full bg-card border-l flex flex-col">

      {/* Search */}
      <div className="p-4 border-b">
        <div className="flex items-center bg-muted/40 px-4 py-2 rounded-lg gap-2">
          <Search size={18} className="opacity-50" />
          <input
            className="w-full bg-transparent outline-none"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search"
          />
        </div>
      </div>

      {/* Chat Items */}
      <div className="flex-1 overflow-y-auto">
        {chats.length ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelect(chat)}
              className={`px-4 py-3 border-b cursor-pointer hover:bg-muted/30 
                ${chat.id === selectedId ? "bg-muted/40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                  {chat.partner.fname.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <div className="font-semibold truncate">
                      {toPascalCase(chat.partner.fname)} {chat.partner.lname}
                    </div>

                    {chat.latestMessage && (
                      <div className="text-xs opacity-60">
                        {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>

                  {chat.latestMessage && (
                    <div className="text-xs opacity-70 truncate">
                      {chat.latestMessage.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex justify-center items-center opacity-60">
            No Chats
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
