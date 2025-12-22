import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { WalletDTO, WalletInputDTO, WalletOutputDTO } from "../../dtos/walletDTO";
import { IGetUserwalletInfoUseCase } from "../../interface/useCases/client/IGetUserwalletInfoUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class GetUserwalletInfoUseCase implements IGetUserwalletInfoUseCase {
    constructor(
        private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(input: WalletInputDTO): Promise<WalletOutputDTO> {

        try {

            const { userId, currentPage, limit } = input;


            const wallet = await this._walletRepository.findByUserIdWithTransactions(userId, currentPage, limit);

            if (!wallet) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));
            }

            const mappedData: WalletDTO = {
                userId: wallet.data.userId,
                balance: wallet.data.balance,
                transactions: wallet.data.transactions.map(tx => ({
                    transactionId: tx.transactionId,
                    amount: tx.amount,
                    status: tx.status,
                    type: tx.type,
                    date: tx.createdAt,
                    bookingId: tx.metadata?.bookingId
                }))
            };

            return {
                data: mappedData,
                total: wallet.totalTransactions
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}