export interface ChatListItem {
    id: string;
    partner: {
        id: string;
        fname: string;
        lname: string;
    };
    latestMessage?: {
        id: string;
        senderId: string;
        content: string;
        createdAt: Date;
    } | null;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "call"
    callStatus?:  "accepted" | "rejected";
    createdAt: Date;
    isRead: boolean;
}

