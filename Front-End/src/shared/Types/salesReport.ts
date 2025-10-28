export type SalesPreset = "today" | "thisWeek" | "thisMonth"

export type SalesReport = {
	id: string; //booingId
	serviceCharge: string;
	distanceFee: string;
	commission: string;
	bookingDate: string;
	totalAmount: string;
}

