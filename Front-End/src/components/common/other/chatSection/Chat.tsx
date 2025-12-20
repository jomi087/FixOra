import { useEffect, useRef, useState } from "react";
import { Loader2, Search, Send, Video } from "lucide-react";
import { BsCameraVideo } from "react-icons/bs";
import { MdImage,/*MdInsertDriveFile */ } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import AuthService from "@/services/AuthService";
import { useAppSelector } from "@/store/hooks";
import { Messages, MPP } from "@/utils/constant";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ChatListItem, ChatMessage } from "@/shared/typess/chat";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { toPascalCase } from "@/utils/helper/utils";
import socket from "@/services/soket";
import { formatChatDate } from "@/utils/helper/chatDate";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { MessageRenderer } from "./message/MessageRenderer";
import { PiPhoneCallLight } from "react-icons/pi";
import { FaPhoneSlash } from "react-icons/fa6";
import { ImageModal } from "../../modal/ImageModal";

type IncomingCall = {
  roomID: string;
  callFrom: string;
  callerName: string;
}

const Chat = () => {

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);

  const [messageInput, setMessageInput] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = MPP;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const { user } = useAppSelector((state) => state.auth);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  //attachments
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  // VIDEO CALL STATES
  const zegoContainerRef = useRef<HTMLDivElement | null>(null);
  const [isZegoCallActive, setIsZegoCallActive] = useState(false);
  const [zegoRoomID, setZegoRoomID] = useState<string | null>(null);
  const kitTokenRef = useRef<string | null>(null);

  const [incomingCall, setIncomingCall] = useState<null | IncomingCall>(null);
  const [isCalling, setIsCalling] = useState(false);

  //chat list
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

  const reorderChatList = (prev: ChatListItem[], updatedChat: ChatListItem) => {
    // remove old position
    const filtered = prev.filter(c => c.id !== updatedChat.id);

    // put updated chat at top
    return [updatedChat, ...filtered];
  };

  useEffect(() => {

    //previous code to make reOrder chat list logic update to below once
    // const handleChatListUpdate = (msg: ChatMessage) => {
    //   setChatList(prev =>
    //     prev.map(chat =>
    //       chat.id === msg.chatId ? {
    //         ...chat,
    //         latestMessage: {
    //           id: msg.id,
    //           content: msg.content,
    //           senderId: msg.senderId,
    //           createdAt: msg.createdAt,
    //          }
    //       }: chat 
    //  ))};

    const handleChatListUpdate = (msg: ChatMessage) => {
      setChatList(prev => {
        const updatedChat = prev.find(c => c.id === msg.chatId);
        if (!updatedChat) return prev;

        const newChat = {
          ...updatedChat,
          latestMessage: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
          }
        };

        return reorderChatList(prev, newChat);
      });
    };

    socket.on("chat:list:update", handleChatListUpdate);
    return () => {
      socket.off("chat:list:update", handleChatListUpdate);
    };
  }, []);



  //load chat
  const handleChatSelect = async (chat: ChatListItem) => {
    setSelectedChat(chat);
    socket.emit("chat:joinRoom", chat.id);
    setPage(1);
    setChatMessages([]);
    await loadMessages(chat.id, 1, limit);
  };

  const loadMessages = async (chatId: string, page: number, limit: number) => {
    if (!user) return;

    try {
      let res = await AuthService.getChatMessages(user.role, chatId, page, limit);

      const total = res.data.result.total;
      const newMessages = res.data.result.data;

      setTotalMessages(total);

      // PAGE 1 → replace messages + scroll bottom
      if (page === 1) {
        setChatMessages(newMessages);

        // this logic is used to scroll till botom
        requestAnimationFrame(() => {
          const container = messageContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });

        return;
      }

      // PAGE > 1 → prepend old messages
      const container = messageContainerRef.current;
      if (container) {
        const oldScrollTop = container.scrollTop;
        const oldHeight = container.scrollHeight;

        setChatMessages(prev => [...newMessages, ...prev]);

        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - oldHeight + oldScrollTop;
        });
      }

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  //send Msg 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !user || !messageInput.trim()) return;
    try {
      await AuthService.sendChatMessages(user.role, selectedChat.id, messageInput);
      setMessageInput("");

      // const createdMessage = res.data.chatMessage;
      // setChatMessages(prev => [...prev, createdMessage]);

      // setChatList(prev => prev.map((cL) =>
      //   cL.id === selectedChat.id ? {
      //     ...cL,
      //     latestMessage: {
      //       id: createdMessage.id,
      //       content: createdMessage.content,
      //       senderId: createdMessage.senderId,
      //       createdAt: createdMessage.createdAt,
      //     },
      //   } : cL
      // ));

      requestAnimationFrame(() => {
        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (!user) return;

    const handler = (msg: ChatMessage) => {
      console.log("this is the chtMsg", msg);
      setChatList(prev => {
        const updatedChat = prev.find(c => c.id === msg.chatId);
        if (!updatedChat) return prev;

        const newChat = {
          ...updatedChat,
          latestMessage: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
          }
        };

        return reorderChatList(prev, newChat);
      });

      // if (msg.senderId === user.userId) return; // this will stop current to show soket reponse 

      if (selectedChat?.id === msg.chatId) {
        setChatMessages(prev => [...prev, msg]);

        requestAnimationFrame(() => {
          const container = messageContainerRef.current;
          if (!container) return;

          const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;

          if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
          }
        });
      }
    };

    socket.on("chat:newMessage", handler);
    return () => {
      socket.off("chat:newMessage", handler);
    };
  }, [selectedChat]);

  const handleScrollTop = async () => {
    if (!selectedChat) return;
    const container = messageContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= 5 && !isLoadingMore && chatMessages.length < totalMessages) {

      setIsLoadingMore(true);

      const nextPage = page + 1;
      setPage(nextPage);

      await loadMessages(selectedChat.id, nextPage, limit);

      // allow next load after the messages + scroll stabilizes
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 200);
    }
  };

  const handleSendImage = async (file: File) => {
    if (!selectedChat || !user) return;

    const formData = new FormData();
    formData.append("type", "image");
    formData.append("file", file);

    try {
      await AuthService.sendChatMessageWithFile(
        user.role,
        selectedChat.id,
        formData
      );

      requestAnimationFrame(() => {
        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Image upload failed");
    }
  };

  // ============= VIDEO CALL LOGIC =============

  const handleStartCall = () => {
    if (!selectedChat || !user) return;

    const roomID = selectedChat.id;
    const callFrom = user.userId;
    const callTo = selectedChat.partner.id;
    const callerName = `${user.fname}`;


    // Tell B that someone is calling
    socket.emit("zego:call:invite", { roomID, callFrom, callTo, callerName });

    setIsCalling(true); // UI state for caller
  };

  // --- Function to join Zego call (caller or receiver) ---
  const startZegoCall = (roomID: string) => {
    if (!user) return;

    // Build unique roomID for the 1-to-1 chat
    const userID = user.userId;
    const userName = user.fname || "Guest";

    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("Zego appID / serverSecret missing");
      return;
    }

    // Generate kit token (for dev / test only)
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    kitTokenRef.current = kitToken;
    setZegoRoomID(roomID);
    setIsZegoCallActive(true);
  };

  useEffect(() => {
    if (!isZegoCallActive) return;
    if (!zegoRoomID) return;

    const container = zegoContainerRef.current;
    if (!container) return; // Wait for div to render

    if (!kitTokenRef.current) return;

    const zp = ZegoUIKitPrebuilt.create(kitTokenRef.current);

    zp.joinRoom({
      container,
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showPreJoinView: false,

      onLeaveRoom: () => {
        zp.destroy();
        setIsZegoCallActive(false);
        setZegoRoomID(null);
        kitTokenRef.current = null;
      },
    });
  }, [isZegoCallActive, zegoRoomID]);


  const acceptCall = async () => {
    if (!incomingCall || !user) return;


    try {
      await AuthService.logCall(user.role, incomingCall.roomID, {
        callerId: incomingCall.callFrom,
        status: "accepted",
      });

      requestAnimationFrame(() => {
        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }

    // socket.emit("zego:call:accept", {
    //   roomID: incomingCall.roomID,
    //   callTo: incomingCall.callFrom,
    // });

    startZegoCall(incomingCall.roomID); // reciver person join Zego room
    setIncomingCall(null);
  };

  const rejectCall = async () => {
    if (!incomingCall || !user) return;


    await AuthService.logCall(user.role, incomingCall.roomID, {
      callerId: incomingCall.callFrom,
      status: "rejected",
    });

    // socket.emit("zego:call:reject", {
    //   callTo: incomingCall.callFrom,
    // });

    setIncomingCall(null);
  };

  useEffect(() => {
    const onIncoming = (data: { roomID: string; callFrom: string; callerName: string }) => {
      setIncomingCall({
        roomID: data.roomID,
        callFrom: data.callFrom,
        callerName: data.callerName,
      });
    };

    const onAccepted = (data: { roomID: string }) => {
      setIsCalling(false);
      startZegoCall(data.roomID);  // caller joins after accepted
    };

    const onRejected = (data: { reason: string }) => {
      setIsCalling(false);
      toast.info(data.reason || "Call rejected");
    };

    socket.on("zego:call:incoming", onIncoming);
    socket.on("zego:call:accepted", onAccepted);
    socket.on("zego:call:rejected", onRejected);

    return () => {
      socket.off("zego:call:incoming", onIncoming);
      socket.off("zego:call:accepted", onAccepted);
      socket.off("zego:call:rejected", onRejected);
    };
  }, []);

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
        <ResizablePanel defaultSize={75}
          className={`flex flex-col ${selectedChat ? "" : "hidden sm:block"} `}>
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
                    <div className="font-semibold text-foreground">{`${toPascalCase(selectedChat.partner.fname)} ${selectedChat.partner.lname ?? ""}`}</div>
                    <div className="text-xs text-muted-foreground">online</div>
                  </div>
                </div>
                <Button
                  className=" cursor-pointer items-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                  variant={"outline"}
                  onClick={handleStartCall}
                >
                  <BsCameraVideo className="hover:text-foreground transition-colors" size={28} />
                  <span className="font-roboto text-xs">Call</span>
                </Button>
              </div>

              {/* Chat Messages Area */}
              <div
                ref={messageContainerRef}
                onScroll={handleScrollTop}
                className="flex-1 overflow-y-auto thin-scrollbar bg-muted/10 dark:bg-muted/5 p-6 space-y-3">

                {chatMessages.map((msg, index) => {
                  const currentDate = formatChatDate(msg.createdAt);

                  const prevMsg = chatMessages[index - 1];
                  const prevDate = prevMsg ? formatChatDate(prevMsg.createdAt) : null;

                  const showSeparator = currentDate !== prevDate;

                  return (
                    <div key={msg.id} >
                      {showSeparator && (
                        <div className="flex justify-center my-4">
                          <div className="bg-card/80 dark:bg-card/60 text-muted-foreground text-xs px-4 py-1.5 rounded-full shadow-sm">
                            {currentDate}
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex ${msg.senderId === user.userId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-md relative rounded-xl  ${msg.senderId === user.userId
                            ? "bg-green-700/85 text-white rounded-br-none "
                            : "bg-gray-900/90 border border-border/40 text-white rounded-bl-none"
                          }`}
                        >
                          {/* Message Section */}
                          {msg.type === "call" ? (
                            <div className="text-sm font-roboto leading-relaxed break-words py-3 px-3.5 flex items-center gap-2">
                              <div className="border-2 border-white p-1 rounded-full">
                                {(() => {
                                  switch (msg.callStatus) {
                                  case "accepted":
                                    return <PiPhoneCallLight size={23} />;
                                  case "rejected":
                                    return <FaPhoneSlash size={25} />;
                                  default:
                                    return <PiPhoneCallLight size={23} />;
                                  }
                                })()}
                              </div>
                              <span>{msg.content}</span>
                            </div>
                          ) : msg.type === "image" ? (
                            msg.file?.url ? (
                              <ImageModal
                                src={msg.file.url}
                                alt="Experience Certificate"
                                trigger={
                                  <img
                                    src={msg.file.url}
                                    className="max-w-55 cursor-pointer"
                                    alt="chat image"
                                  />
                                }
                              />
                            ) : (
                              <div className=" text-xs text-muted-foreground font-mono leading-relaxed break-words pr-13 pl-3 py-1.5">
                                ⚠️ Image unavailable
                              </div>
                            )
                          ) : (
                            <div className=" text-sm font-mono leading-relaxed break-words pr-13 pl-3 py-1.5">
                              {msg.content}
                            </div>
                          )}
                          {/* Timestamp */}
                          <div
                            className={`absolute bottom-1 right-2 text-[9px] ${msg.senderId === user.userId
                              ? "text-white"
                              : "text-white/70"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Message Input */}
              <div className="bg-card border-t border-border px-2 py-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSendImage(e.target.files[0]);
                    }
                  }} />

                <div className="flex items-center p-1 gap-2">
                  <div className="relative">
                    {/* Attachment Menu */}
                    {showAttachments && (
                      <div className="absolute bottom-16 -left-2 bg-card border border-border rounded-xl shadow-xl p-2 w-36 animate-in fade-in zoom-in-150">
                        {/* Image */}
                        <button
                          onClick={() => {
                            fileInputRef.current?.click(); // open file picker
                            setShowAttachments(false);
                          }}
                          className="flex items-center gap-3 w-full px-1 py-1 rounded-lg hover:bg-muted/50 transition"
                        >
                          <div className="w-7 h-7 rounded-full bg-blue-500/15 flex items-center justify-center">
                            <MdImage size={14} className="text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">Image</span>
                        </button>


                        {/* Document */}
                        {/* <button
                          onClick={() => {
                            console.log("Document upload");
                            setShowAttachments(false);
                          }}
                          className="flex items-center gap-3 w-full px-1 py-1 rounded-lg hover:bg-muted/50 transition"
                        >
                          <div className="w-7 h-7 rounded-full bg-purple-500/15 flex items-center justify-center">
                            <MdInsertDriveFile size={14} className="text-purple-500" />
                          </div>
                          <span className="text-xs font-medium">Document</span>
                        </button> */}
                      </div>
                    )}

                    {/* Attachment Icon */}
                    <button
                      onClick={() => setShowAttachments((prev) => !prev)}
                      className={`p-1.5 rounded-full active:scale-90 transition hover:bg-gray-300 hover:dark:bg-black/40 ${showAttachments ? "bg-gray-300 dark:bg-black/40" : ""} `}
                    >
                      <GoPlus
                        size={25}
                        className={`transition-transform duration-400 ${showAttachments ? "rotate-135" : "rotate-0"} `}
                      />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min={"1"}
                    max={"50"}
                    placeholder="Search"
                    className="flex-1 bg-muted/50 dark:bg-muted/30 text-foreground placeholder:text-muted-foreground px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <Button
                    className="cursor-pointer bg-blue-500 dark:bg-blue-500 text-white  hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors active:scale-95"
                    disabled={!messageInput.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send size={18} />
                  </Button>

                  {/* <Button
                    className=" cursor-pointer text-muted-foreground border border-primary hover:text-foreground transition-colors active:scale-95"
                    variant={"outline"}
                    onClick={handleStartCall}
                  >
                    <Video className="hover:text-foreground transition-colors" size={22} />
                  </Button> */}
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle className="hidden md:flex bg-border hover:bg-primary/20 transition-colors" />

        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}
          className={`${selectedChat ? "hidden sm:block" : ""}`}
        >
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
                              {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
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

      {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="fixed bottom-4 right-4 bg-card border-2 border-green-500 shadow-2xl rounded-xl p-6 flex flex-col gap-4 z-50 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Video className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg">Incoming Video Call</span>
              <span className="text-sm text-muted-foreground">
                From: {incomingCall.callerName}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
              onClick={acceptCall}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              className="flex-1 font-semibold"
              onClick={rejectCall}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {isCalling && (
        <div className="fixed bottom-6 right-6 bg-card border border-primary px-4 py-2 rounded-xl shadow-lg z-50">
          <p className="font-semibold">Calling…</p>
        </div>
      )}

      {/* Video Call Overlay */}
      {isZegoCallActive && (
        <div
          ref={zegoContainerRef}
          className="fixed inset-0 z-50 bg-black"
        />
      )}

    </div >
  );
};

export default Chat;