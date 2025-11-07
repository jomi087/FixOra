import { Dispute } from "../../entities/DisputeEntity";

export interface IDisputeRepository {
    /**
     * Persists a new Dispute entity to the database.
     * @param dispute - The Dispute entity containing all required details.
     * @returns The created Dispute entity.
     */
    create(dispute: Dispute): Promise<Dispute>;

    /**
     * Finds a dispute by its unique disputeId.
     * @param disputeId - The unique identifier of the dispute.
     * @returns The Dispute if found, otherwise null.
     */
    findById(disputeId: string): Promise<Dispute | null>;

    /**
     * Find existing dispute by the user on same contentId 
     * @param userId 
     * @param contentId 
     */
    findExistingDispute(userId: string, contentId: string): Promise<boolean>;

    /**
     * Updates the status and optional admin note of a dispute.
     * @param disputeId - The ID of the dispute to update.
     * @param status - The new dispute status.
     * @param adminNote - Optional admin note with action details.
     * @returns The updated Dispute if found, otherwise null.
     */
    updateStatus(disputeId: string, status: string, adminNote?: { adminId: string; action: string }): Promise<Dispute | null>;

    /**
     * Retrieves all disputes matching optional filter conditions.
     * @param filters - Partial filter criteria.
     * @returns An array of Dispute entities.
     */
    findAll(filters?: Partial<Dispute>): Promise<Dispute[]>;
}
