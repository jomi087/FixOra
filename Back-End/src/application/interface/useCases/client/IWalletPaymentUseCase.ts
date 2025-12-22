import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../../dto/walletDTO";

export interface IWalletPaymentUseCase {
    execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO>
}