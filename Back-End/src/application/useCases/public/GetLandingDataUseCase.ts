import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { GetLandingDataOutputDTO } from "../../DTO's/LandingPageDto";
import { IGetLandingDataUseCase } from "../../Interface/useCases/Public/IGetLandingDataUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetLandingDataUseCase implements IGetLandingDataUseCase{
    constructor(
        private readonly _categoryRepository : ICategoryRepository
    ) { }
    
    async execute():Promise<GetLandingDataOutputDTO> {
        try {
            const categories = await this._categoryRepository.findActiveCategories(["subcategories"]);
            // top 5 providers image data  will add later
            //top 6 blogs  data
            //mapp all 3 data
            return {
                categories 
                //providers
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

