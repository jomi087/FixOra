import { WalletInputDTO, WalletOutputDTO } from "../../../dtos/WalletDTO/walletDTO";

export interface IGetUserwalletInfoUseCase {
    execute(input: WalletInputDTO): Promise<WalletOutputDTO>
}