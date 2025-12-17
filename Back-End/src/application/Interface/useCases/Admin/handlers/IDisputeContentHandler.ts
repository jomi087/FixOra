import { DisputeContentOutput } from "../../../../dtos/DisputeDTO";

export interface IDisputeContentHandler {
  getContent(contentId: string): Promise<DisputeContentOutput>;
}