import { CallStatus } from "../../../shared/types/common";

export interface ChatMessageListItem {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  callStatus?: CallStatus;
  file?: {
    url: string;
    mimeType: string;
    size: number;
  };
  createdAt: Date;
  isRead: boolean;
}