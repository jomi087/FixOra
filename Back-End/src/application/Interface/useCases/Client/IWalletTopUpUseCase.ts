import { RoleEnum } from "../../../../shared/enumss/Roles";

export interface WalletTopUpInput{
    userId: string;
    role: RoleEnum;
    amount: number;
}

export interface IWalletTopUpUseCase{
    execute(input:WalletTopUpInput):Promise<string>
}