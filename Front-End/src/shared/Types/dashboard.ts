export type TimeRange = "yearly" | "monthly" | "weekly" | "daily"

export interface BaseStats {
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
}

export interface GrowthStats {
    newCustomers: number;
    newProviders: number;
}

export type BookingStats = {
    date: string;
    bookingCount: number;
    bookingRevenue: number;
}


export type BookingServiceStats = {
    service: string;
    booked: number
}

export type TopProvider = {
    providerUserId: string;
    providerName: string,
    jobCount: number
}