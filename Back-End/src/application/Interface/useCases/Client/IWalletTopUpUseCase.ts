import { RoleEnum } from "../../../../shared/Enums/Roles";

export interface WalletTopUpInput{
    userId: string;
    role: RoleEnum;
    amount: number;
}

export interface IWalletTopUpUseCase{
    execute(input:WalletTopUpInput):Promise<string>
}