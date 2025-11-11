import { Dispute } from "../../entities/DisputeEntity";
import { User } from "../../entities/UserEntity";

export interface IDisputeRepository {
    /**
     * Persists a new Dispute entity to the database.
     * @param dispute - The Dispute entity containing all required details.
     */
    create(dispute: Dispute): Promise<Dispute>;

    /**
     * Finds a dispute by its unique disputeId.
     * @param disputeId - The unique identifier of the dispute.
     */
    findById(disputeId: string): Promise<Dispute | null>;

    /**
     * Find existing dispute by the user on same contentId 
     * @param userId 
     * @param contentId 
     */
    findExistingDispute(userId: string, contentId: string): Promise<boolean>;

    /**
     * Fetches a paginated list of disputes based on search and filter criteria.
     * Performs text search, filtering by type and status, and applies pagination.
     * @param options - Contains search and filter (Filtering options for dispute type and status) parameters for the query 
     * @param currentPage  
     * @param limit
    */
    findDisputeWithFilters(
        searchQuery: string,
        filterType: string,
        filterStatus: string,
        page: number,
        limit: number
    ): Promise<{
        data: {
            dispute: Pick<Dispute, "disputeId" | "disputeType" | "reason" | "status" | "createdAt">
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "role">,
        }[]; total: number;
    }>

    /**
     * Updates the status and optional admin note of a dispute.
     * @param disputeId - The ID of the dispute to update.
     * @param status - The new dispute status.
     * @param adminNote - Optional admin note with action details.
    */
    updateStatus(disputeId: string, status: string, adminNote ?: { adminId: string; action: string }): Promise<Dispute | null>;

}


