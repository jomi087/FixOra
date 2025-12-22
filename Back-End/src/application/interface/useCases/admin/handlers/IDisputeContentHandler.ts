import { DisputeContentOutput } from "../../../../dto/DisputeDTO";

export interface IDisputeContentHandler {
  getContent(contentId: string): Promise<DisputeContentOutput>;
}