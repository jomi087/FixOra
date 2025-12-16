import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { Messages } from "../../../shared/const/Messages";
import { DisputeType } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { DisputeContentOutput } from "../../DTOs/DisputeDTO";
import { IDisputeContentHandler } from "../../Interface/useCases/Admin/handlers/IDisputeContentHandler";
import { IDisputeContentInfoUseCase } from "../../Interface/useCases/Admin/IDisputeContentInfoUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { DISPUTE_NOT_FOUND, INVALID_TYPE } = Messages;

export class DisputeContentInfoUseCase implements IDisputeContentInfoUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly _handlers: Record<DisputeType, IDisputeContentHandler>
    ) { }

    async execute(disputeId: string): Promise<DisputeContentOutput> {
        try {
            const disputeData = await this._disputeRepository.findById(disputeId);
            if (!disputeData) throw new AppError(NOT_FOUND, DISPUTE_NOT_FOUND);

            const handler = this._handlers[disputeData.disputeType];
            if (!handler) throw new AppError(NOT_FOUND, INVALID_TYPE("Dispute"));

            return await handler.getContent(disputeData.contentId);

        } catch (error: unknown) {
            throw error;
        }
    }
}