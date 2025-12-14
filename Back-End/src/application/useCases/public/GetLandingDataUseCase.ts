import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { GetLandingDataOutputDTO } from "../../DTOs/LandingPageDto";
import { IGetLandingDataUseCase } from "../../Interface/useCases/Public/IGetLandingDataUseCase";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { LANDING_PAGE_TOP_PROVIDERS_LIMIT } from "../../../shared/const/constants";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetLandingDataUseCase implements IGetLandingDataUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(): Promise<GetLandingDataOutputDTO> {
        try {
            const categories = await this._categoryRepository.findActiveCategories(["subcategories"]);
            const providers = await this._bookingRepository.topProvider(LANDING_PAGE_TOP_PROVIDERS_LIMIT);
            //top 6 blogs  data
            return {
                categories,
                providers
                //blogs
            };
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

