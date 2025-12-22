import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IPaymentService } from "../../../domain/interface/serviceInterface/IPaymentService";
import { IWalletTopUpUseCase, WalletTopUpInput } from "../../Interface/useCases/clientTemp/IWalletTopUpUseCase";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


export class WalletTopupUseCase implements IWalletTopUpUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _walletRepository : IWalletRepository
    ) { }

    async execute(input: WalletTopUpInput): Promise<string> {
        try {
            const { amount, role, userId } = input;

            let wallet = await this._walletRepository.findByUserId(userId);
            if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));
            
            return await this._paymentService.createWalletTopUpIntent(userId, role, amount);
            
        } catch (error: unknown) {
            throw error;
        }
    }
}