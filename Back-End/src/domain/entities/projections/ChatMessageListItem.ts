import { CallStatus } from "../../../shared/types/common";

export interface ChatMessageListItem {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  callStatus?: CallStatus;
  createdAt: Date;
  isRead: boolean;
}