import { IRatingRepository } from "../../../../domain/interface/repositoryInterfaceTempName/IRaitingRepository";
import { Messages } from "../../../../shared/const/Messages";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../../shared/errors/AppError";
import { DisputeContentOutput } from "../../../dtos/DisputeDTO";
import { IDisputeContentHandler } from "../../../Interface/useCases/admin/handlers/IDisputeContentHandler";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, } = Messages;

export class ReviewDisputeContentHandler implements IDisputeContentHandler {
    constructor(
        private readonly _ratingRepository: IRatingRepository
    ) { }

    async getContent(contentId: string): Promise<DisputeContentOutput> {
        try {
            const contentData = await this._ratingRepository.findReviewById(contentId);
            if (!contentData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Review"));

            const mappedData = {
                id: contentData.rating.ratingId,
                rating: contentData.rating.rating,
                description: contentData.rating.feedback,
                date: contentData.rating.createdAt,
                user: {
                    userId: contentData.user.userId,
                    name: `${contentData.user.fname} ${contentData.user.lname || ""}`,
                    email: contentData.user.email,
                    role: contentData.user.role,
                },
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}
