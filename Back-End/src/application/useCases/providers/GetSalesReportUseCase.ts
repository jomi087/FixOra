import { endOfDay, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { SalesReportInputDTO, SalesReportOutputDTO } from "../../dto/SalesReportDTO";
import { IGetSalesReportUseCase } from "../../interface/useCases/provider/IGetSalesReportUseCase";
import { SalesPreset } from "../../../shared/types/salesReport";

export class GetSalesReportUseCase implements IGetSalesReportUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: SalesReportInputDTO): Promise<SalesReportOutputDTO> {
        try {
            const { preset, startDate, endDate, providerUserId } = input;


            const { start, end } = this.getDateRange(preset, startDate, endDate);

            let salesData = await this._bookingRepository.findProviderSalesByDateRange(
                providerUserId,
                start,
                end
            );

            const mappedData: SalesReportOutputDTO = {
                totalCompletedSaleAmount: salesData.totalCompletedSaleAmount,
                refundAmount: salesData.refundAmount,
                summaryCount: {
                    total: salesData.total,
                    completed: salesData.completed,
                    cancelled: salesData.cancelled,
                    pendingWork: salesData.pendingWork,
                },
                completeHistory: salesData.history.map(b => ({
                    bookingId: b.bookingId,
                    serviceCharge: b.pricing.baseCost,
                    distanceFee: b.pricing.distanceFee,
                    commission: b.commission,
                    Date: b.paymentInfo?.paidAt || "N/A",
                }))
            };
            return mappedData;
        } catch (error: unknown) {
            throw error;
        }
    }

    private getDateRange(preset?: SalesPreset, startDate?: string, endDate?: string) {
        const today = new Date();
        let start: Date;
        let end: Date;

        switch (preset) {
        case "today":
            start = startOfDay(today);
            end = endOfDay(today);
            break;
        case "thisWeek":
            start = startOfWeek(today, { weekStartsOn: 1 });
            end = endOfDay(today);
            break;
        case "thisMonth":
            start = startOfMonth(today);
            end = endOfDay(today);
            break;
        default:
            start = startDate ? startOfDay(startDate) : startOfDay(today);
            end = endDate ? endOfDay(endDate) : startOfDay(today);
            break;
        }

        return { start, end };
    }
}
