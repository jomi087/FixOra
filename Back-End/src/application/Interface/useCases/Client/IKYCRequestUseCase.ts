import { KYCInputDTO } from "../../../DTO's/KYCDTO";


export interface IKYCRequestUseCase{
    execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted">
}