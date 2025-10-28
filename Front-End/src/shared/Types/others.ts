export type Platform = "web" | "app"  


export interface CommissionFee {
	fee: number;
	feeHistory: {
		amount: number;
		createdAt: string;
	}[];
}
