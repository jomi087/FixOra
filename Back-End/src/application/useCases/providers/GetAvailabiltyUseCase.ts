import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { DAYS } from "../../../shared/const/constants";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { Day } from "../../../shared/types/availability";
import { getAvailabilityOutputDTO } from "../../dtos/AvailabilityDTO";
import { IGetAvailabilityUseCase } from "../../Interface/useCases/Provider/IGetAvailabilityUseCase";
import { AppError } from "../../../shared/errors/AppError";


const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IAvailabilityRepository
    ) { }
    async execute(providerUserId: string): Promise<getAvailabilityOutputDTO[]> {
        try {

            let provider = await this._providerRepository.findByUserId(providerUserId);
            if (!provider) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));


            let availability = await this._availabilityRepository.getProviderAvialability(provider.providerId);

            if (!availability) {

                const workTime = DAYS.map((day) => ({
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

        } catch (error: unknown) {
            throw error;
        }
    }
}