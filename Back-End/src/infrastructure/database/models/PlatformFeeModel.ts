import { Schema, Document, model } from "mongoose";
import { PlatformFee } from "../../../domain/entities/PlatfromFeeEntity";

export interface IPlatformFeeModel extends Document, PlatformFee { }

const platformFeeSchema = new Schema<IPlatformFeeModel>({
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

const PlatformFeeModel = model<IPlatformFeeModel>("PlatformFee", platformFeeSchema);
export default PlatformFeeModel;
