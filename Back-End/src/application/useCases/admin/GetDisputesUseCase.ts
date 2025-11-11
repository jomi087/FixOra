import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DisputeListItemDTO, DisputeListResponseDTO, FilterDisputeInputDTO } from "../../DTOs/DisputeDTO";
import { IGetDisputesUseCase } from "../../Interface/useCases/Admin/IGetDisputesUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetDisputesUseCase implements IGetDisputesUseCase {
    constructor(
        private readonly _disputeRepository: IDisputeRepository,
    ) { }

    async execute(input: FilterDisputeInputDTO): Promise<DisputeListResponseDTO> {
        try {
            const { searchQuery, filterType, filterStatus, limit, page } = input;
            
            const { data, total } = await this._disputeRepository.findDisputeWithFilters(
                searchQuery,
                filterType, filterStatus,
                page, limit
            );

            const mappedData: DisputeListItemDTO[] = data.map(({ dispute, user }) => ({
                disputeId: dispute.disputeId,
                disputeType: dispute.disputeType,
                reportedBy: {
                    userId: user.userId,
                    name: `${user.fname} ${user.lname ?? ""} `,
                    email: user.email,
                    role: user.role
                },
                reason : dispute.reason,
                status : dispute.status,
                createdAt : dispute.createdAt,
            }));

            return {
                data: mappedData,
                total,
            };

        } catch(error) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}