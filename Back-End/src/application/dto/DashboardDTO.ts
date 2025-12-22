export type TimeRange = "yearly" | "monthly" | "weekly" | "daily"

export interface DashboardStatsOutputDTO {
	overview: {
		totalRevenue: number;
		penalityRevenue: number;
		customers: {
			total: number;
			blocked: number;
		};
		providers: {
			total: number;
			blocked: number;
		};
		services: {
			total: number;
			inactive: number;
		};
	};
	growth: {
		newCustomers: number;
		newProviders: number;
	};
	bookingsOverTime: {
		date: string; 
		bookingCount: number;
		bookingRevenue: number;
	}[];
	bookingsByService: {
		service: string;
		booked: number;
	}[];
	topProviders: {
		providerUserId: string;
		providerName: string;
		jobCount: number;
	}[];
}
