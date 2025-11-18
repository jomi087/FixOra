import { useEffect, useRef, useState } from "react";
import { Loader2, Search, Send, Video } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import AuthService from "@/services/AuthService";
import { useAppSelector } from "@/store/hooks";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ChatListItem, ChatMessage } from "@/shared/types/chat";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { toPascalCase } from "@/utils/helper/utils";

const Chat = () => {
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const { user } = useAppSelector((state) => state.auth);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!user) return;
    const loadChatList = async () => {
      try {
        let res = await AuthService.getChats(user.role, debouncedQuery);
        setChatList(res.data.chatList);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg);
      }
    };
    loadChatList();
  }, [debouncedQuery]);


  const handleChatSelect = async (chat: ChatListItem) => {
    setSelectedChat(chat);
    setPage(1);
    setChatMessages([]);
    await loadMessages(chat.id, 1);
  };

  const loadMessages = async (chatId: string, page: number) => {
    if (!user) return;

    try {
      let res = await AuthService.getChatMessages(user.role, chatId, page);

      const total = res.data.result.total;
      const newMessages = res.data.result.data;

      setTotalMessages(total);
      // For page 1 → replace
      if (page === 1) {
        setChatMessages(newMessages);
      }
      // For page > 1 → prepend older messages
      else {
        setChatMessages((prev) => [...newMessages, ...prev]);
      }

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  const handleScrollTop = async () => {
    if (!selectedChat) return;

    const container = messageContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && chatMessages.length < totalMessages) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadMessages(selectedChat.id, nextPage);
    }
  };

  if (!user) {
    return (
      <div className="border flex justify-center items-center text-center text-gray-500 w-full h-full gap-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        <span>Loading Chat...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full"
      >
        <ResizablePanel defaultSize={80} className="flex flex-col">
          {!selectedChat ? (
            <div className="flex justify-center items-center h-full bg-muted/20">
              <div className="text-center px-8">
                <div className="w-32 h-32 mx-auto mb-8 bg-primary/10 dark:bg-primary/5 rounded-full flex items-center justify-center">
                  <div className="text-6xl opacity-60">💬</div>
                </div>
                <div className="text-3xl font-semibold mb-3 text-foreground">
                  FixOra Chat
                </div>
                <div className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Send and receive messages seamlessly
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="bg-card border-b border-border px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-3xl font-bold font-serif text-white shadow-md">
                    {selectedChat.partner.fname.charAt(0).toLocaleUpperCase() ?? "N/A"}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{`${selectedChat.partner.fname} ${selectedChat.partner.lname ?? ""}`}</div>
                    <div className="text-xs text-muted-foreground">online</div>
                  </div>
                </div>
                {/* <div className="flex items-center gap-6 text-muted-foreground">
                  <Video className="cursor-pointer hover:text-foreground transition-colors" size={22} />
                  <Phone className="cursor-pointer hover:text-foreground transition-colors" size={22} />
                  <MoreVertical className="cursor-pointer hover:text-foreground transition-colors" size={22} />
                </div> */}
              </div>

              {/* Chat Messages Area */}
              <div
                ref={messageContainerRef}
                onScroll={handleScrollTop}
                className="flex-1 overflow-y-auto thin-scrollbar bg-muted/10 dark:bg-muted/5 p-6 space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="bg-card/80 dark:bg-card/60 text-muted-foreground text-xs px-4 py-1.5 rounded-full shadow-sm">
                    Today
                  </div>
                </div>

                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.userId ? "justify-end" : "justify-start"}`}
                  >
                    <div>
                      <div
                        className={`max-w-md px-3 py-1 rounded-lg shadow-sm ${msg.senderId === user.userId
                          ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-none"
                          : "bg-card dark:bg-card text-foreground rounded-bl-none border border-border/50"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                      </div>
                      <div
                        className={`text-xs mt-1 ${msg.senderId === user.userId
                          ? "text-blue-100 dark:text-blue-200  text-right"
                          : "text-muted-foreground  text-right"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-card border-t border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Search"
                    className="flex-1 bg-muted/50 dark:bg-muted/30 text-foreground placeholder:text-muted-foreground px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Button
                    className="cursor-pointer bg-blue-500 dark:bg-blue-500 text-white  hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors active:scale-95"
                    disabled={!messageInput}
                  >
                    <Send size={18} />
                  </Button>

                  <Button
                    className=" cursor-pointer text-muted-foreground border border-primary hover:text-foreground transition-colors active:scale-95"
                    variant={"outline"}
                  >
                    <Video className=" hover:text-foreground transition-colors" size={22} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle className="hidden md:flex bg-border hover:bg-primary/20 transition-colors" />

        <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="hidden md:block">
          <div className="h-full bg-card border-l border-border flex flex-col">

            {/* Search Bar */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center bg-muted/50 dark:bg-muted/30 px-4 py-2.5 rounded-lg gap-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto thin-scrollbar">
              {chatList.length > 0 ? (
                chatList.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`px-4 py-3 cursor-pointer border-b border-border/50 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors ${selectedChat?.id === chat.id ? "bg-muted/60 dark:bg-muted/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-2xl font-bold font-roboto text-white flex-shrink-0 shadow-sm">
                        {chat.partner.fname.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <div className="font-semibold text-foreground truncate pr-2">
                            {`${toPascalCase(chat.partner.fname)} ${chat.partner.lname ?? ""}`}
                          </div>
                          {chat.latestMessage &&
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(chat.latestMessage.createdAt).toLocaleTimeString()}
                            </div>
                          }
                        </div>
                        {chat.latestMessage &&
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground truncate pr-2">
                              {chat.latestMessage.content}
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center  h-full">
                  <p>No Booking Made</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;