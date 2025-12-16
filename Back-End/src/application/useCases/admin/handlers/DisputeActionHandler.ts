import { Dispute } from "../../../../domain/entities/DisputeEntity";
// import { ITransactionSession } from "../../../../domain/interface/DatabaseInterface/ITransactionManager";
import { IRatingRepository } from "../../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { Messages } from "../../../../shared/const/Messages";
import { DisputeStatus } from "../../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../../shared/errors/AppError";
import { IDisputeActionHandler } from "../../../Interface/useCases/Admin/handlers/IDisputeActionHandler";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class ReviewDisputeActionHandler implements IDisputeActionHandler {
    constructor(
        private readonly _ratingRepository: IRatingRepository
    ) { }

    async takeAction(dispute: Dispute, /*txSession?: ITransactionSession*/): Promise<void> {
        try {

            if (dispute.status === DisputeStatus.RESOLVED) {
                const aknowledge = await this._ratingRepository.deactivateRating(dispute.contentId /*txSession*/);
                if (!aknowledge) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Review"));
            }

        } catch (error: unknown) {
            throw error;
        }

    }
}
