// vedio with simple peer


import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, PhoneOff, Search, Send, Video, VideoOff } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import AuthService from "@/services/AuthService";
import { useAppSelector } from "@/store/hooks";
import { Messages, MPP } from "@/utils/constant";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ChatListItem, ChatMessage } from "@/shared/types/chat";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { toPascalCase } from "@/utils/helper/utils";
import socket from "@/services/soket";
import { formatChatDate } from "@/utils/helper/chatDate";

// import IncomingCallPopup from "./IncomingCallPopup";
// import OutgoingCallControl from "./OutgoingCallControl";

type IncomingCall = {
  callId: string;
  fromUserId: string;
  chatId: string;
};

type OutgoingCall = {
  callId: string;
  toUserId: string;
  chatId: string;
};

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


  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);
  const [callStatus, setCallStatus] = useState<"idle" | "ringing" | "in-call">("idle");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);



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
      let res = await AuthService.sendChatMessages(user.role, selectedChat.id, messageInput);

      const createdMessage = res.data.chatMessage;
      setMessageInput("");

      setChatMessages(prev => [...prev, createdMessage]);

      setChatList(prev => prev.map((cL) =>
        cL.id === selectedChat.id ? {
          ...cL,
          latestMessage: {
            id: createdMessage.id,
            content: createdMessage.content,
            senderId: createdMessage.senderId,
            createdAt: createdMessage.createdAt,
          },
        } : cL
      ));

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

      if (msg.senderId === user.userId) return; // this will stop current to show soket reponse 

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

  // ============= VIDEO CALL LOGIC =============

  // Start call (caller)
  const handleStartCall = async () => {
    if (!selectedChat || !user) return;

    const callId = `${selectedChat.id}-${Date.now()}`;
    const toUserId = selectedChat.partner.id;

    console.log("Starting call to:", toUserId);

    setOutgoingCall({ callId, toUserId, chatId: selectedChat.id });
    setCallStatus("ringing");

    socket.emit("call:request", {
      callId,
      toUserId,
      chatId: selectedChat.id,
    });

  };

  const createPeerConnection = () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // free STUN for now (update to TURN)
      ],
    });

    // When remote adds tracks, we get them here
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream) {
        console.log("stream is empty");
        return;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setHasRemoteStream(true);
    };

    // Send ICE candidates to the other peer through socket
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      const callId = outgoingCall?.callId || incomingCall?.callId;
      const toUserId = outgoingCall?.toUserId || incomingCall?.fromUserId;

      if (!callId || !toUserId) return;

      socket.emit("call:iceCandidate", {
        callId,
        toUserId,
        candidate: event.candidate,
      });
    };

    pcRef.current = pc;
    return pc;
  };

  const startLocalStream = async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    // attach to local video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // also add tracks to peer connection (if exists)
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    return stream;
  };

  useEffect(() => {
    if (!user) return;

    // Incoming call (receiver side)
    const onIncoming = (payload: { callId: string; fromUserId: string; chatId: string; }) => {
      if (callStatus !== "idle") {
        socket.emit("call:reject", {
          callId: payload.callId,
          toUserId: payload.fromUserId,
          reason: "busy",
        });
        return;
      }

      setIncomingCall({
        callId: payload.callId,
        fromUserId: payload.fromUserId,
        chatId: payload.chatId,
      });
      setCallStatus("ringing");

    };

    // Caller side: callee accepted
    const onAccepted = async (payload: { callId: string; fromUserId: string }) => {
      if (!outgoingCall || outgoingCall.callId !== payload.callId) return;

      setCallStatus("in-call");

      // Caller: prepare local stream + peer connection and send offer
      await startLocalStream();
      const pc = createPeerConnection();

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call:offer", {
        callId: payload.callId,
        toUserId: payload.fromUserId, // callee
        sdp: offer,
      });
    };

    // Caller side: callee rejected
    const onRejected = (payload: { callId: string; fromUserId: string; reason?: string }) => {
      if (!outgoingCall || outgoingCall.callId !== payload.callId) return;
      toast.info(`Call rejected${payload.reason ? `: ${payload.reason}` : ""}`);
    };

    // Receiver side: caller cancelled before you answered
    const onCancelled = (payload: { callId: string; fromUserId: string }) => {
      if (!incomingCall || incomingCall.callId !== payload.callId) return;
      toast.info("Call cancelled");
    };

    // Either side: call ended
    const onEnded = (payload: { callId: string; fromUserId: string }) => {
      if (
        (outgoingCall && outgoingCall.callId === payload.callId) ||
        (incomingCall && incomingCall.callId === payload.callId)
      ) {
        toast.info("Call ended");
        // cleanupCall();
      }
    };

    // Receiver side: got WebRTC offer
    const onOffer = async (payload: { callId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
      if (!incomingCall || incomingCall.callId !== payload.callId) return;

      setCallStatus("in-call");

      await startLocalStream();
      const pc = createPeerConnection();

      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call:answer", {
        callId: payload.callId,
        toUserId: payload.fromUserId,
        sdp: answer,
      });
    };

    // Caller side: got WebRTC answer
    const onAnswer = async (payload: { callId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
      if (!outgoingCall || outgoingCall.callId !== payload.callId) return;

      const pc = pcRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    };

    // Both sides: ICE candidate from remote
    const onRemoteIceCandidate = async (payload: { callId: string; fromUserId: string; candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current;
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (err) {
        console.error("Error adding received ice candidate", err);
      }
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", onRejected);
    socket.on("call:cancelled", onCancelled);
    socket.on("call:ended", onEnded);
    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:iceCandidate", onRemoteIceCandidate);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", onRejected);
      socket.off("call:cancelled", onCancelled);
      socket.off("call:ended", onEnded);
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:iceCandidate", onRemoteIceCandidate);
    };
  }, [user, callStatus, outgoingCall, incomingCall]);

  const handleCancelOrEndCall = () => {
    if (callStatus === "ringing" && outgoingCall) {

      console.log("Cancelling call");
      socket.emit("call:cancel", {
        callId: outgoingCall.callId,
        toUserId: outgoingCall.toUserId,
      });
      cleanupCall();

    } else if (callStatus === "in-call") {

      console.log("Ending call");
      const toUserId = outgoingCall?.toUserId || incomingCall?.fromUserId || "";
      const callId = outgoingCall?.callId || incomingCall?.callId || "";
      if (callId && toUserId) {
        socket.emit("call:end", { callId, toUserId });
      }
      cleanupCall();

    }
  };

  const toggleMute = () => {
    if (!localStream) return;

    const shouldMute = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !shouldMute;
    });
    setIsMuted(shouldMute);
  };

  const toggleVideo = () => {
    if (!localStream) return;

    const shouldTurnOff = !isVideoOff;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !shouldTurnOff;
    });
    setIsVideoOff(shouldTurnOff);
  };

  const cleanupCall = () => {
    // Close peer connection
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setLocalStream(null);
    setHasRemoteStream(false);
    setIncomingCall(null);
    setOutgoingCall(null);
    setCallStatus("idle");
    setIsMuted(false);
    setIsVideoOff(false);
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
                    <div className="font-semibold text-foreground">{`${selectedChat.partner.fname} ${selectedChat.partner.lname ?? ""}`}</div>
                    <div className="text-xs text-muted-foreground">online</div>
                  </div>
                </div>
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
                          className={`max-w-md px-4 py-1.5 rounded-2xl shadow-sm relative ${msg.senderId === user.userId
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-card border border-border/40 rounded-bl-none text-foreground"
                          }`}
                        >
                          {/* Message Text */}
                          <div className="text-sm font-mono leading-relaxed break-words pr-10">
                            {msg.content}
                          </div>

                          {/* Timestamp */}
                          <span
                            className={`absolute bottom-1 right-2 text-[10px] ${msg.senderId === user.userId
                              ? "text-blue-100"
                              : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Message Input */}
              <div className="bg-card border-t border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min={"1"}
                    max={"50"}
                    placeholder="Search"
                    className="flex-1 bg-muted/50 dark:bg-muted/30 text-foreground placeholder:text-muted-foreground px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Button
                    className="cursor-pointer bg-blue-500 dark:bg-blue-500 text-white  hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors active:scale-95"
                    disabled={!messageInput.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send size={18} />
                  </Button>

                  <Button
                    className=" cursor-pointer text-muted-foreground border border-primary hover:text-foreground transition-colors active:scale-95"
                    variant={"outline"}
                    onClick={handleStartCall}
                    disabled={callStatus !== "idle"}
                  >
                    <Video className=" hover:text-foreground transition-colors" size={22} />
                  </Button>
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
      {incomingCall && callStatus === "ringing" && (
        <div className="fixed bottom-4 right-4 bg-card border-2 border-green-500 shadow-2xl rounded-xl p-6 flex flex-col gap-4 z-50 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Video className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg">Incoming Video Call</span>
              <span className="text-sm text-muted-foreground">
                From: {chatList.find(c => c.partner.id === incomingCall.fromUserId)?.partner.fname || "Unknown"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
              onClick={async () => {
                if (!user || !incomingCall) return;

                // Accept the call
                socket.emit("call:accept", {
                  callId: incomingCall.callId,
                  toUserId: incomingCall.fromUserId,
                });

                setCallStatus("in-call");
              }}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              className="flex-1 font-semibold"
              onClick={() => {
                if (!incomingCall || !user) return;
                socket.emit("call:reject", {
                  callId: incomingCall.callId,
                  toUserId: incomingCall.fromUserId,
                  reason: "declined",
                });
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Video Call Overlay */}
      {(callStatus === "in-call" || (callStatus === "ringing" && outgoingCall)) && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Remote video (big screen) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Remote Video Element - Always render but might be empty */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!hasRemoteStream ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
            />

            {/* Placeholder when no remote stream (ringing or waiting for stream) */}
            {(!hasRemoteStream || callStatus === "ringing") && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                  {/* Avatar Circle */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <span className="text-5xl font-bold text-white">
                      {selectedChat?.partner.fname.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>

                  {/* Status Text */}
                  <div className="space-y-2">
                    {callStatus === "ringing" ? (
                      <>
                        <p className="text-white text-2xl font-semibold">Calling...</p>
                        <p className="text-gray-400 text-lg">
                          {selectedChat?.partner.fname} {selectedChat?.partner.lname}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-400 text-sm">Waiting for response</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-white text-2xl font-semibold">Connecting...</p>
                        <p className="text-gray-400">Establishing video connection</p>
                        <div className="flex items-center justify-center gap-1 mt-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Local video (small corner) */}
            <div className="absolute bottom-20 right-6 w-48 h-36 bg-gray-900 rounded-xl shadow-2xl border-2 border-white/30 overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                  <VideoOff className="text-white mb-2" size={32} />
                  <span className="text-white text-xs">Camera Off</span>
                </div>
              )}
              {/* Mini screen label */}
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                You
              </div>
            </div>

            {/* Call status indicator - Top Center */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl">
                <p className="text-white font-semibold flex items-center gap-3">
                  {callStatus === "ringing" ? (
                    <>
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
                      <span>Ringing...</span>
                    </>
                  ) : hasRemoteStream ? (
                    <>
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                      <span>Connecting...</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Call Controls - Bottom Center */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center gap-4 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-2xl">
                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${isMuted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <MicOff className="text-white" size={22} />
                  ) : (
                    <Mic className="text-white" size={22} />
                  )}
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleCancelOrEndCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                  title="End Call"
                >
                  <PhoneOff className="text-white" size={26} />
                </button>

                {/* Video Toggle Button */}
                <button
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${isVideoOff
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title={isVideoOff ? "Turn on camera" : "Turn off camera"}
                >
                  {isVideoOff ? (
                    <VideoOff className="text-white" size={22} />
                  ) : (
                    <Video className="text-white" size={22} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Chat;