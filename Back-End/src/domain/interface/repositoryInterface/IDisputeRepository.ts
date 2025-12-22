import { DisputeStatus } from "../../../shared/enums/Dispute";
import { Dispute } from "../../entities/DisputeEntity";
import { User } from "../../entities/UserEntity";
// import { ITransactionSession } from "../databaseInterface/ITransactionManager";

export interface IDisputeRepository {
    /**
     * Persists a new Dispute entity to the database.
     * @param dispute
     * @returns A Promise resolving to the newly created dispute entity.
    */
    create(dispute: Dispute): Promise<Dispute>;

    /**
     * Finds a dispute by its unique disputeId.
     * @param disputeId
     * @returns A Promise resolving to the dispute entity if found, otherwise null.
    */
    findById(disputeId: string): Promise<Dispute | null>;

    /**
     * Find existing dispute by the user on same contentId 
     * @param userId 
     * @param contentId
     * @returns A Promise resolving to true if a dispute exists, otherwise false.
    */
    findExistingDispute(userId: string, contentId: string): Promise<boolean>;

    /**
     * Retrieves a paginated list of disputes filtered by search, type, and status.
     * Performs a text search on dispute data, applies type/status filters, and paginates results.
     * @param searchQuery 
     * @param filterType 
     * @param filterStatus 
     * @param page
     * @param limit
     * @returns A Promise resolving to a paginated result containing dispute-user pairs and the total count.
    */
    findDisputeWithFilters(
        searchQuery: string,
        filterType: string,
        filterStatus: string,
        page: number,
        limit: number
    ): Promise<{
        data: {
            dispute: Pick<Dispute, "disputeId" | "disputeType" | "reason" | "status" | "createdAt" | "adminNote">
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "role">,
            admin: Pick<User, "fname" | "lname">
        }[]; total: number;
    }>

    /**
     * Updates dispute by updatating the status, Admin ( info, notes )and resolvedAt
     * @param disputeId - The ID of the dispute to update.
     * @param status - The new dispute status.
     * @param adminNote -  admin info & note of action details.
     * @returns A Promise resolving to the updated Dispute entity, or null if not found.
    */
    updateDispute(
        disputeId: string,
        status: DisputeStatus,
        adminNote: {
            adminId: string;
            action: string
        },
        // txSession?: ITransactionSession
    ): Promise<Dispute | null>;

}


