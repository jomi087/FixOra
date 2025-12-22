import { Schema, Document, model } from "mongoose";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { Wallet } from "../../../domain/entities/WalletEntity";


const walletTransaction = new Schema({
    transactionId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
    },
    type: {
        type: String,
        enum: Object.values(TransactionType),
    },
    reason: {
        type: String,
    },
    metadata: {
        type: Schema.Types.Mixed, // flexible object
    }
}, {
    _id: false,
    timestamps: true
});

export interface IWalletModel extends Document, Wallet { }


const walletSchema = new Schema<IWalletModel>({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [walletTransaction],

}, {
    timestamps: true
});

const WalletModel = model<IWalletModel>("Wallet", walletSchema);
export default WalletModel;
