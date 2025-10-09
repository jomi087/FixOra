import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../../DTOs/WalletDTO/walletPaymentDTO";

export interface IWalletPaymentUseCase {
    execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO>
}