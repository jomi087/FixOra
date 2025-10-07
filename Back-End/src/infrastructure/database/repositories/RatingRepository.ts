import { Rating } from "../../../domain/entities/RatingEntity";
import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { RatingModel } from "../models/RatingModel";

export class RatingRepository implements IRatingRepository {
    async findByBookingID(bookingId: string): Promise<Rating | null> {
        return RatingModel.findOne({ bookingId }).lean();
    }

    async create(rating: Rating): Promise<void> {
        await new RatingModel(rating).save();
    }

    async findAllByProviderId(providerId: string): Promise<Rating[]> {
        return RatingModel.find({ providerId }).lean();
    }
}