import { Day } from "../../../shared/types/availability";
import { Availability, DaySchedule } from "../../entities/AvailabilityEntity";

export interface IAvailabilityRepository {
    create(availability: Availability): Promise<Availability>
    storeWorkingTime(providerId: string, workTime: DaySchedule[]): Promise<Availability|null>
    getProviderAvialability(providerId: string): Promise<Availability | null>
    toogleAvailability(providerId: string, day: Day, toogle: boolean): Promise<void>;
}