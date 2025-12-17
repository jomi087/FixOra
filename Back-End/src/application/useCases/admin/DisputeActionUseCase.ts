import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { DisputeType } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { DisputeActionInputDTO, DisputeActionOutputDTO } from "../../dtos/DisputeDTO";
import { IDisputeActionHandler } from "../../Interface/useCases/Admin/handlers/IDisputeActionHandler";
import { IDisputeActionUseCase } from "../../Interface/useCases/Admin/IDisputeActionUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, INVALID_TYPE } = Messages;

export class DisputeActionUseCase implements IDisputeActionUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly _handlers: Record<DisputeType, IDisputeActionHandler>,
        private readonly _userReporitory: IUserRepository,
        // private readonly transactionManager: ITransactionManager
    ) { }

    async execute(input: DisputeActionInputDTO): Promise<DisputeActionOutputDTO> {

        // const tx = await this.transactionManager.start();

        try {
            const { disputeId, status, userId, reason } = input;
            const disputeData = await this._disputeRepository.findById(disputeId);
            if (!disputeData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Dispute"));

            const handler = this._handlers[disputeData.disputeType];
            if (!handler) throw new AppError(NOT_FOUND, INVALID_TYPE("Dispute"));

            const updatedDispute = await this._disputeRepository.updateDispute(
                disputeId,
                status,
                { adminId: userId, action: reason },
            );
            if (!updatedDispute || !updatedDispute.adminNote) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Dispute"));

            await handler.takeAction(updatedDispute);

            const adminData = await this._userReporitory.findByUserId(updatedDispute.adminNote.adminId, ["password", "refreshToken"]);
            if (!adminData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));

            const mappedData: DisputeActionOutputDTO = {
                status: updatedDispute.status,
                adminNote: {
                    name: `${adminData.fname} ${adminData.lname ?? ""}`,
                    action: updatedDispute.adminNote.action
                }
            };
            return mappedData;

        } catch (error:unknown) {
            // await tx.rollback();
            throw error;
           
        } //finally { await tx.end() }
    }
}