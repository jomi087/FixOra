import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { ProviderApplicationDTO, ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../DTO's/ProviderApplicationDTO";
import { IProviderApplicationUseCase } from "../../Interface/useCases/Admin/IProviderApplicationUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class ProviderApplicationUseCase implements IProviderApplicationUseCase {
    constructor(
        private readonly _kycRequestRepository: IKYCRequestRepository,
        private readonly _imageUploaderService: IImageUploaderService,

    ) { }

    async execute(input: ProviderApplicationInputDTO): Promise<ProviderApplicationOutputDTO> {
        try {
            const { searchQuery, filter, currentPage, limit } = input;

            const { data, total } = await this._kycRequestRepository.findWithFilters({ searchQuery, filter }, currentPage, limit);

            if (data.length) {
                console.log("data", data[0].kycInfo);
            }
            
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
                profileImage: this._imageUploaderService.getSignedUrl(kycInfo.profileImage,50000),
                serviceCharge: kycInfo.serviceCharge,
                kyc: {
                    idCard: this._imageUploaderService.getSignedUrl(kycInfo.kyc?.idCard,50000),
                    certificate: {
                        education: this._imageUploaderService.getSignedUrl(kycInfo.kyc?.certificate?.education,50000),
                        experience: this._imageUploaderService.getSignedUrl(kycInfo.kyc.certificate.experience ?? "",50000),
                    },
                },
                status: kycInfo.status,
                submittedAt: kycInfo.submittedAt,
                reason: kycInfo.reason,
                reviewedAt: kycInfo.reviewedAt,
                reviewedBy: kycInfo.reviewedBy,
            }));

            console.log("mappedData",mappedData);

            return {
                data: mappedData,
                total
            };

        } catch (error: any) {
           
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}