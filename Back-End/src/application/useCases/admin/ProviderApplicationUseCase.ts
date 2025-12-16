import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import { ProviderApplicationDTO, ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../DTOs/ProviderApplicationDTO";
import { IProviderApplicationUseCase } from "../../Interface/useCases/Admin/IProviderApplicationUseCase";


export class ProviderApplicationUseCase implements IProviderApplicationUseCase {
    constructor(
        private readonly _kycRequestRepository: IKYCRequestRepository
    ) { }

    async execute(input: ProviderApplicationInputDTO): Promise<ProviderApplicationOutputDTO> {
        try {
            const { searchQuery, filter, currentPage, limit } = input;

            const { data, total } = await this._kycRequestRepository.findWithFilters({ searchQuery, filter }, currentPage, limit);

            const mappedData: ProviderApplicationDTO[] = data.map(({ id, user, kycInfo, category }) => ({
                id: id,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname || "",
                    email: user.email,
                    mobileNo: user.mobileNo || "N/A",
                    location: user.location
                },
                dob: kycInfo.dob,
                gender: kycInfo.gender,
                service: {
                    categoryId: category.categoryId || "N/A",
                    name: category.name || "N/A",
                    subcategories: (category.subcategories ?? []).map((sub) => ({
                        subCategoryId: sub.subCategoryId,
                        name: sub.name,
                    })),
                },
                profileImage: kycInfo.profileImage,
                serviceCharge: kycInfo.serviceCharge,
                kyc: {
                    idCard: kycInfo.kyc?.idCard,
                    certificate: {
                        education: kycInfo.kyc?.certificate?.education,
                        experience: kycInfo.kyc?.certificate?.experience,
                    },
                },
                status: kycInfo.status,
                submittedAt: kycInfo.submittedAt,
                reason: kycInfo.reason,
                reviewedAt: kycInfo.reviewedAt,
                reviewedBy: kycInfo.reviewedBy,
            }));

            return {
                data: mappedData,
                total
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}