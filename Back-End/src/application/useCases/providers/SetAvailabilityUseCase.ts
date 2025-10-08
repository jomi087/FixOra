import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { Day } from "../../../shared/types/availability";
import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../DTO's/AvailabilityDTO";
import { ISetAvailabilityUseCase } from "../../Interface/useCases/Provider/ISetAvailabilityUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND } = Messages;

export class SetAvailabilityUseCase implements ISetAvailabilityUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IAvailabilityRepository
    ) { }
    async execute(input: setAvailabilityInputDTO): Promise<setAvailabilityOutputDTO[]> {

        try {
            let provider = await this._providerRepository.findByUserId(input.providerUserId);
            if (!provider) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };
            // console.log("inputSchedule", input.schedule);

            const workTime = Object.entries(input.schedule)//input.schedule: Record<Day, { slots: string[], active: boolean }>;
                .map(([day, value,]) => ({
                    day: day as Day,
                    slots: [...value.slots].sort((a, b) => {
                        // compare hours and minutes
                        const [ah, am] = a.split(":").map(Number);
                        const [bh, bm] = b.split(":").map(Number);
                        return ah === bh ? am - bm : ah - bh;
                    }),
                    active: value.active
                }));
            // console.log("workTime", workTime);

            const availability = await this._availabilityRepository.storeWorkingTime(provider.providerId, workTime);
            if (!availability) throw { status: NOT_FOUND, message: "Availability not found" };

            const mappedData: setAvailabilityOutputDTO[] = availability.workTime;
            return mappedData;

        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}