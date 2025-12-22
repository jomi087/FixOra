import { WalletInputDTO, WalletOutputDTO } from "../../../dto/walletDTO";

export interface IGetUserwalletInfoUseCase {
    execute(input: WalletInputDTO): Promise<WalletOutputDTO>
}