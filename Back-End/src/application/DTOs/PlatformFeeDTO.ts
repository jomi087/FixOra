
export interface PlatformFeeDTO {
	fee: number;
	feeHistory: {
		amount: number;
		createdAt: Date;
	}[];
}
