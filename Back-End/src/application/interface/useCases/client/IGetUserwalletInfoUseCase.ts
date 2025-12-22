import { WalletInputDTO, WalletOutputDTO } from "../../../dtos/walletDTO";

export interface IGetUserwalletInfoUseCase {
    execute(input: WalletInputDTO): Promise<WalletOutputDTO>
}