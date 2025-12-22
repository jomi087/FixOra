import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../../dtos/walletDTO";

export interface IWalletPaymentUseCase {
    execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO>
}