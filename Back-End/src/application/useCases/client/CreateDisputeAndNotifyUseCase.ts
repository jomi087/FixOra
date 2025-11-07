import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { Messages } from "../../../shared/const/Messages";
import { DisputeStatus } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DisputeInputDTO } from "../../DTOs/DisputeDTO";
import { ICreateDisputeAndNotifyUseCase } from "../../Interface/useCases/Client/ICreateDisputeAndNotifyUseCase";
import { v4 as uuidv4 } from "uuid";
import { buildDisputeReportEmail } from "../../services/emailTemplates/disputeReportTemplate";

const { INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, USER_NOT_FOUND } = Messages;


export class CreateDisputeAndNotifyUseCase implements ICreateDisputeAndNotifyUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService,
    ) { }

    /** @inheritdoc */
    async execute(input: DisputeInputDTO): Promise<void> {
        try {
            const existingDispute = await this._disputeRepository.findExistingDispute(input.userId, input.contextId);
            if (existingDispute) throw { status: CONFLICT, message: `You’ve already reportedt this ${input.disputeType.toLocaleLowerCase()}` };

            const userEmail = await this._userRepository.findUserEmail(input.userId);
            if (!userEmail) throw { status: NOT_FOUND, message: USER_NOT_FOUND };


            const dispute = await this._disputeRepository.create({
                disputeId: uuidv4(),
                disputeType: input.disputeType,
                contentId: input.contextId,
                reportedBy: input.userId,
                reason: input.reason,
                status: DisputeStatus.PENDING,
                createdAt: new Date()
            });

            const html = buildDisputeReportEmail({
                disputeId: dispute.disputeId,
                disputeType: input.disputeType,
            });

            await this._emailService.sendEmail(userEmail, " Thank-you for your report - FixOra", html);
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
