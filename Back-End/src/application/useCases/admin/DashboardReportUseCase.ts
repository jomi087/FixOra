import { endOfDay, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { DashboardStatsOutputDTO, TimeRange } from "../../dtos/DashboardDTO";
import { IDashboardReportUseCase } from "../../Interface/useCases/admin/IDashboardReportUseCase";
import { IBookingRepository } from "../../../domain/interface/repositoryInterfaceTempName/IBookingRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterfaceTempName/IUserRepository";
import { ICategoryRepository } from "../../../domain/interface/repositoryInterfaceTempName/ICategoryRepository";

export class DashboardReportUseCase implements IDashboardReportUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    private getDateRange(range: TimeRange = "monthly") {
        const today = new Date();
        let start: Date;
        let end: Date;

        switch (range) {
        case "daily":
            start = startOfDay(today);
            end = endOfDay(today);
            break;
        case "weekly":
            start = startOfWeek(today, { weekStartsOn: 1 });
            end = endOfDay(today);
            break;
        case "monthly":
            start = startOfMonth(today);
            end = endOfDay(today);
            break;
        case "yearly":
            start = startOfYear(today);
            end = endOfDay(today);
            break;
        };
        return { start, end };
    }

    async execute(range: TimeRange): Promise<DashboardStatsOutputDTO> {
        try {
            const { start, end } = this.getDateRange(range);
            const [userStats, serviceStats, bookingStats] = await Promise.all([
                this._userRepository.dashboardUserStats(start, end),
                this._categoryRepository.dashboardServiceStats(start, end),
                this._bookingRepository.dashboardBookingStats(start, end),
            ]);
            const mappedData: DashboardStatsOutputDTO = {
                overview: {
                    totalRevenue: bookingStats.totalRevenue,
                    penalityRevenue: bookingStats.penalityRevenue,
                    customers: {
                        total: userStats.totalCustomers,
                        blocked: userStats.blockedCustomers,
                    },
                    providers: {
                        total: userStats.totalProviders,
                        blocked: userStats.blockedProviders,
                    },
                    services: {
                        total: serviceStats.totalServices,
                        inactive: serviceStats.blockedServices,
                    },
                },
                // Growth metrics within selected date range
                growth: {
                    newCustomers: userStats.newCustomers,
                    newProviders: userStats.newProviders,
                },
                // Time-series data (bookings and revenue trends)
                bookingsOverTime: bookingStats.bookingStatsByDate.map(dataSet => ({
                    date: dataSet.date,
                    bookingCount: dataSet.totalBookings,
                    bookingRevenue: dataSet.totalRevenue,
                })),
                // Service performance metrics
                bookingsByService: bookingStats.bookingCountByService.map(dataSet => ({
                    service: dataSet.serviceName,
                    booked: dataSet.count,
                })),
                topProviders: bookingStats.topProviders
            };
            return mappedData;
        } catch (error: unknown) {
            throw error;
        }
    }

}