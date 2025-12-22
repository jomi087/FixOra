import { IDisputeRepository } from "../../../domain/interface/repositoryInterface/IDisputeRepository";
import { DisputeListItemDTO, DisputeListResponseDTO, FilterDisputeInputDTO } from "../../dtos/DisputeDTO";
import { IGetDisputesUseCase } from "../../interfacetemp/useCases/admin/IGetDisputesUseCase";


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

            const mappedData: DisputeListItemDTO[] = data.map(({ dispute, user, admin }) => ({
                disputeId: dispute.disputeId,
                disputeType: dispute.disputeType,
                reportedBy: {
                    userId: user.userId,
                    name: `${user.fname} ${user.lname ?? ""} `,
                    email: user.email,
                    role: user.role
                },
                reason: dispute.reason,
                status: dispute.status,
                adminNote: admin && dispute.adminNote ? {
                    name: `${admin.fname} ${admin.lname ?? ""} `,
                    action: dispute.adminNote.action
                } : undefined,
                createdAt: dispute.createdAt,
            }));

            return {
                data: mappedData,
                total,
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}