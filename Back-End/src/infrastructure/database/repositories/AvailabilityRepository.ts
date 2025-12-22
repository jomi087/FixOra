import { Availability, DaySchedule } from "../../../domain/entities/AvailabilityEntity";
import { IAvailabilityRepository } from "../../../domain/interface/repositoryInterface/IAvailabilityRepository";
import { Day } from "../../../shared/types/availability";
import AvailabilityModel from "../models/AvailabilityModel";

export class AvailabilityRepository implements IAvailabilityRepository {

    async create(availability: Availability): Promise<Availability> {
        return new AvailabilityModel(availability).save();
    }

    async storeWorkingTime(providerId: string, workTime: DaySchedule[]): Promise<Availability|null> {
        return await AvailabilityModel.findOneAndUpdate(
            { providerId: providerId },
            { $set: { workTime } },
            { new: true }
        );
    }

    async getProviderAvialability(providerId: string): Promise<Availability | null> {
        return await AvailabilityModel.findOne({ providerId });
    }

    async toogleAvailability(providerId: string, day: Day, toogle: boolean): Promise<void> {
        await AvailabilityModel.updateOne(
            { providerId: providerId, "workTime.day": day },
            { $set: { "workTime.$.active": toogle } }
        );
    }
}