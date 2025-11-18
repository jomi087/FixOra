export interface ChatMessageListItem {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}