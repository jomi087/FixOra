
export interface CommissionFeeDTO {
	fee: number;
	feeHistory: {
		amount: number;
		createdAt: Date;
	}[];
}