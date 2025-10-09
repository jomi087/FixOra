import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { IWalletTopUpUseCase, WalletTopUpInput } from "../../Interface/useCases/Client/IWalletTopUpUseCase";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, WALLET_ID_NOT_FOUND } = Messages;


export class WalletTopupUseCase implements IWalletTopUpUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _walletRepository : IWalletRepository
    ) { }

    async execute(input: WalletTopUpInput): Promise<string> {
        try {
            const { amount, role, userId } = input;

            let wallet = await this._walletRepository.findByUserId(userId);
            if (!wallet) throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };
            
            return await this._paymentService.createWalletTopUpIntent(userId, role, amount);
            
        } catch (error) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}