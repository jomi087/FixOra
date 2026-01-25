import { DashboardStatsOutputDTO, TimeRange } from "../../dto/DashboardDTO";
import { IDashboardReportUseCase } from "../../interface/useCases/admin/IDashboardReportUseCase";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";

export class DashboardReportUseCase implements IDashboardReportUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(params: {
        range: TimeRange;
        from: Date;
        to: Date;
    }): Promise<DashboardStatsOutputDTO> {
        try {
            const { from, to } = params;

            const [userStats, serviceStats, bookingStats] = await Promise.all([
                this._userRepository.dashboardUserStats(from, to),
                this._categoryRepository.dashboardServiceStats(from, to),
                this._bookingRepository.dashboardBookingStats(from, to),
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