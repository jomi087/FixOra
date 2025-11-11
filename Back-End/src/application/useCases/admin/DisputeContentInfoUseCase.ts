import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { Messages } from "../../../shared/const/Messages";
import { DisputeType } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DisputeContentOutput } from "../../DTOs/DisputeDTO";
import { IDisputeContentHandler } from "../../Interface/useCases/Admin/handlers/IDisputeContentHandler";
import { IDisputeContentInfoUseCase } from "../../Interface/useCases/Admin/IDisputeContentInfoUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class DisputeContentInfoUseCase implements IDisputeContentInfoUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly handlers: Record<DisputeType, IDisputeContentHandler>
    ) { }

    async execute(disputeId: string): Promise<DisputeContentOutput> {
        try {
            const disputeData = await this._disputeRepository.findById(disputeId);
            if (!disputeData) throw { status: NOT_FOUND, message: "DisputeId Not Found" };

            const handler = this.handlers[disputeData.disputeType];
            if (!handler) throw { status: NOT_FOUND, message: "Unsupported dispute type" };

            return await handler.getContent(disputeData.contentId);
             
        } catch (error) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}