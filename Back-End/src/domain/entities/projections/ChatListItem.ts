export interface ChatListItem {
    id: string;
    partner: {
        id: string;
        fname: string;
        lname: string;
    };
    latestMessage: {
        id: string;
        senderId: string;
        content: string;
        createdAt: Date;
    } | null;
}
