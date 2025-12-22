import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import { GetLandingDataOutputDTO } from "../../dtos/LandingPageDto";
import { IGetLandingDataUseCase } from "../../interface/useCases/public/IGetLandingDataUseCase";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { LANDING_PAGE_TOP_PROVIDERS_LIMIT } from "../../../shared/const/constants";


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
        } catch (error: unknown) {
            throw error;
        }
    }
}

