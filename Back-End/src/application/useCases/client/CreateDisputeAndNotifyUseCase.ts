import { IDisputeRepository } from "../../../domain/interface/repositoryInterface/IDisputeRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/serviceInterface/IEmailService";
import { Messages } from "../../../shared/const/Messages";
import { DisputeStatus } from "../../../shared/enums/Dispute";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DisputeInputDTO } from "../../dtos/DisputeDTO";
import { ICreateDisputeAndNotifyUseCase } from "../../interfacetemp/useCases/client/ICreateDisputeAndNotifyUseCase";
import { v4 as uuidv4 } from "uuid";
import { buildDisputeReportEmail } from "../../services/emailTemplates/disputeReportTemplate";
import { AppError } from "../../../shared/errors/AppError";

const { CONFLICT, NOT_FOUND } = HttpStatusCode;
const { ALREADY_REPORTED_DISPUTE_TYPE, NOT_FOUND_MSG } = Messages;

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
            if (existingDispute) throw new AppError(CONFLICT, ALREADY_REPORTED_DISPUTE_TYPE(input.disputeType.toLocaleLowerCase()));

            const userEmail = await this._userRepository.findUserEmail(input.userId);
            if (!userEmail) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));

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
            
        } catch (error: unknown) {
            throw error;
        }
    }
}
