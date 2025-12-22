import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../../dtos/WalletDTO/walletPaymentDTO";

export interface IWalletPaymentUseCase {
    execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO>
}