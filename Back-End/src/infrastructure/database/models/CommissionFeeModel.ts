import { Schema, Document, model } from "mongoose";
import { CommissionFee } from "../../../domain/entities/CommissionFeeEntity";

export interface ICommissionFeeModel extends Document, CommissionFee { }

const commissionFeeSchema = new Schema<ICommissionFeeModel>({
    fee: {
        type: Number,
        required: true,
        default: 0
    },
    feeHistory: [
        {
            amount: {
                type: Number,
            },
            createdAt: {
                type: Date,
            },
        }
    ]
}, {
    timestamps: true
});

const CommissionFeeModel = model<ICommissionFeeModel>("CommissionFee", commissionFeeSchema);
export default CommissionFeeModel;
