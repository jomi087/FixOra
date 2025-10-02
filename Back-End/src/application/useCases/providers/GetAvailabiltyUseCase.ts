import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { days } from "../../../shared/constants";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { Day } from "../../../shared/types/availability";
import { getAvailabilityOutputDTO } from "../../DTO's/AvailabilityDTO";
import { IGetAvailabilityUseCase } from "../../Interface/useCases/Provider/IGetAvailabilityUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND } = Messages;

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IAvailabilityRepository
    ) { }
    async execute(providerUserId: string): Promise<getAvailabilityOutputDTO[]> {
        try {

            let provider = await this._providerRepository.findByUserId(providerUserId);
            if (!provider) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            let availability = await this._availabilityRepository.getProviderAvialability(provider.providerId);
            
            if (!availability) {

                const workTime = days.map((day) => ({
                    day: day as Day,
                    slots: [],
                    active: false,
                }));

                availability = await this._availabilityRepository.create({
                    providerId: provider.providerId,
                    workTime,
                    createdAt: new Date(),
                });
            }

            const mappedData: getAvailabilityOutputDTO[] = availability.workTime;

            return mappedData;

        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}