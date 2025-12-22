import { IDisputeRepository } from "../../../domain/interface/repositoryInterface/IDisputeRepository";
import { Messages } from "../../../shared/const/Messages";
import { DisputeType } from "../../../shared/enumss/Dispute";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { DisputeContentOutput } from "../../dtos/DisputeDTO";
import { IDisputeContentHandler } from "../../Interface/useCases/admin/handlers/IDisputeContentHandler";
import { IDisputeContentInfoUseCase } from "../../Interface/useCases/admin/IDisputeContentInfoUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, INVALID_TYPE } = Messages;

export class DisputeContentInfoUseCase implements IDisputeContentInfoUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly _handlers: Record<DisputeType, IDisputeContentHandler>
    ) { }

    async execute(disputeId: string): Promise<DisputeContentOutput> {
        try {
            const disputeData = await this._disputeRepository.findById(disputeId);
            if (!disputeData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Dispute"));

            const handler = this._handlers[disputeData.disputeType];
            if (!handler) throw new AppError(NOT_FOUND, INVALID_TYPE("Dispute"));

            return await handler.getContent(disputeData.contentId);

        } catch (error: unknown) {
            throw error;
        }
    }
}