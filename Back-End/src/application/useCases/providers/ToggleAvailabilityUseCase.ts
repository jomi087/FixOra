import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { toggleAvailabilityInputDTO } from "../../DTO's/AvailabilityDTO";
import { IToggleAvailabilityUseCase } from "../../Interface/useCases/Provider/IToggleAvailabilityUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND } = Messages;

export class ToggleAvailabilityUseCase implements IToggleAvailabilityUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IAvailabilityRepository
    ) { }

    async execute(input: toggleAvailabilityInputDTO): Promise<void> {
        try {
            const { day, providerUserId } = input;
            let provider = await this._providerRepository.findByUserId(providerUserId);
            if (!provider) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            let availability = await this._availabilityRepository.getProviderAvialability(provider.providerId);
            if (!availability) throw { status: NOT_FOUND, message: "Availability not found" };

            const daySchedule = availability.workTime.find(d => d.day === day);
            if (!daySchedule) {
                throw { status: NOT_FOUND, message: `No schedule found for ${day}` };
            }

            await this._availabilityRepository.toogleAvailability(provider.providerId, day, !daySchedule.active);
        
        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }


    }
}