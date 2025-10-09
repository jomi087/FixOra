import { WalletInputDTO, WalletOutputDTO } from "../../../DTOs/WalletDTO/walletDTO";

export interface IGetUserwalletInfoUseCase {
    execute(input: WalletInputDTO): Promise<WalletOutputDTO>
}