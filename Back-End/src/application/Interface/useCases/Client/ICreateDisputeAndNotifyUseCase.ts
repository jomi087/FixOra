import { DisputeInputDTO } from "../../../DTOs/DisputeDTO";

/**
 * Use case contract for creating a new review dispute.
 */
export interface ICreateDisputeAndNotifyUseCase {
    /**
    * Executes the use case to create a review dispute.
    * @param input - The input DTO containing user ID, rating ID, and reason for dispute.
    * @returns Resolves with void on success, or throws an error if creation fails.
    */
    execute(input: DisputeInputDTO): Promise<void>
}