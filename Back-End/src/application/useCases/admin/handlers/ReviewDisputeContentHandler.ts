import { IRatingRepository } from "../../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { Messages } from "../../../../shared/const/Messages";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { DisputeContentOutput } from "../../../DTOs/DisputeDTO";
import { IDisputeContentHandler } from "../../../Interface/useCases/Admin/handlers/IDisputeContentHandler";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class ReviewDisputeContentHandler implements IDisputeContentHandler {
    constructor(
        private readonly _ratingRepository: IRatingRepository
    ) { }

    async getContent(contentId: string): Promise<DisputeContentOutput> {
        try {
            const contentData = await this._ratingRepository.findReviewById(contentId);
            if (!contentData) throw { status: NOT_FOUND, message: "ContentId Not Found" };

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

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
