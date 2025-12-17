import { KYCInputDTO } from "../../../dtos/KYCDTO";


export interface IKYCRequestUseCase{
    execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted">
}