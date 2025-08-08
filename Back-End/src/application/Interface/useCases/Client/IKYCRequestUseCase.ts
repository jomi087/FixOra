import { KYCInputDTO } from "../../../DTO's/KYCDTO.js";

export interface IKYCRequestUseCase{
    execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted">
}