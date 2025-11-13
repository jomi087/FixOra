import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { DisputeType } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DisputeActionInputDTO, DisputeActionOutputDTO } from "../../DTOs/DisputeDTO";
import { IDisputeActionHandler } from "../../Interface/useCases/Admin/handlers/IDisputeActionHandler";
import { IDisputeActionUseCase } from "../../Interface/useCases/Admin/IDisputeActionUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, USER_NOT_FOUND } = Messages;

export class DisputeActionUseCase implements IDisputeActionUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly _handlers: Record<DisputeType, IDisputeActionHandler>,
        private readonly _userReporitory: IUserRepository,
        // private readonly transactionManager: ITransactionManager
    ) { }

    async execute(input: DisputeActionInputDTO): Promise<DisputeActionOutputDTO> {

        console.log("entered useCase");
        // const tx = await this.transactionManager.start();

        try {
            const { disputeId, status, userId, reason } = input;
            const disputeData = await this._disputeRepository.findById(disputeId);
            if (!disputeData) throw { status: NOT_FOUND, message: "DisputeId Not Found" };

            const handler = this._handlers[disputeData.disputeType];
            if (!handler) throw { status: NOT_FOUND, message: "Unsupported dispute type" };

            const updatedDispute = await this._disputeRepository.updateDispute(
                disputeId,
                status,
                { adminId: userId, action: reason },
            );
            if (!updatedDispute || !updatedDispute.adminNote) throw { status: NOT_FOUND, message: "Dispute update failed" };
            console.log("updatedDispute",updatedDispute);

            await handler.takeAction(updatedDispute);

            const adminData = await this._userReporitory.findByUserId(updatedDispute.adminNote.adminId, ["password", "refreshToken"]);
            if (!adminData) throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            // await tx.commit();

            const mappedData:DisputeActionOutputDTO= {
                status: updatedDispute.status,
                adminNote: {
                    name: `${adminData.fname} ${adminData.lname ?? ""}`,
                    action: updatedDispute.adminNote.action
                }
            };
            console.log("mappedData",mappedData);
            return mappedData;

        } catch (error) {
            // console.log("error", error);
            // await tx.rollback();
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
            // } finally {
            //     await tx.end();
        }
    }
}