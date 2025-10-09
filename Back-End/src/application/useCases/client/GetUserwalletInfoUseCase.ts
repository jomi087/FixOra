import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { WalletDTO, WalletInputDTO, WalletOutputDTO } from "../../DTOs/WalletDTO/walletDTO";
import { IGetUserwalletInfoUseCase } from "../../Interface/useCases/Client/IGetUserwalletInfoUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, WALLET_ID_NOT_FOUND } = Messages;

export class GetUserwalletInfoUseCase implements IGetUserwalletInfoUseCase {
    constructor(
        private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(input: WalletInputDTO): Promise<WalletOutputDTO> {

        try {

            const { userId, currentPage, limit } = input;

            
            const wallet = await this._walletRepository.findByUserIdWithTransactions(userId, currentPage, limit);
            
            if (!wallet) {
                throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };
            }

            const mappedData: WalletDTO = {
                userId: wallet.data.userId,
                balance: wallet.data.balance,
                transactions: wallet.data.transactions.map(tx => ({
                    transactionId: tx.transactionId,
                    amount: tx.amount,
                    status: tx.status,
                    type: tx.type,
                    date: tx.createdAt
                }))
            };
            
            return {
                data: mappedData,
                total: wallet.totalTransactions
            };

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}