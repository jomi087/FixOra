import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../../DTO's/WalletDTO/walletPaymentDTO";

export interface IWalletPaymentUseCase {
    execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO>
}