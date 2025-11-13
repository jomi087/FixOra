import { Dispute } from "../../../../domain/entities/DisputeEntity";
// import { ITransactionSession } from "../../../../domain/interface/DatabaseInterface/ITransactionManager";
import { IRatingRepository } from "../../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { Messages } from "../../../../shared/const/Messages";
import { DisputeStatus } from "../../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { IDisputeActionHandler } from "../../../Interface/useCases/Admin/handlers/IDisputeActionHandler";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class ReviewDisputeActionHandler implements IDisputeActionHandler {
    constructor(
        private readonly _ratingRepository: IRatingRepository
    ) { }

    async takeAction(dispute: Dispute, /*txSession?: ITransactionSession*/): Promise<void> {
        try {

            if (dispute.status === DisputeStatus.RESOLVED) {
                const aknowledge = await this._ratingRepository.deactivateRating(dispute.contentId /*txSession*/);
                if (!aknowledge) throw { status: NOT_FOUND, message: "ContentId Not Found" };
            }
            
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
