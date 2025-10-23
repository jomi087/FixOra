
export interface PlatformFee {
    fee: number;
    feeHistory: {
        amount: number;
        createdAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
