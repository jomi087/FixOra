export type Platform = "web" | "app"  


export interface PlatformFee {
	fee: number;
	feeHistory: {
		amount: number;
		createdAt: string;
	}[];
}
