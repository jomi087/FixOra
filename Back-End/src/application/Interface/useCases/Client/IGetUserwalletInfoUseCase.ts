import { WalletInputDTO, WalletOutputDTO } from "../../../DTO's/WalletDTO/walletDTO";

export interface IGetUserwalletInfoUseCase {
    execute(input: WalletInputDTO): Promise<WalletOutputDTO>
}