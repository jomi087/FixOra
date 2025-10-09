import { KYCInputDTO } from "../../../DTOs/KYCDTO";


export interface IKYCRequestUseCase{
    execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted">
}