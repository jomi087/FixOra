import { DisputeContentOutput } from "../../../../DTOs/DisputeDTO";

export interface IDisputeContentHandler {
  getContent(contentId: string): Promise<DisputeContentOutput>;
}