import { KYCInputDTO } from "../../../dto/KYCDTO";


export interface IKYCRequestUseCase{
    execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted">
}