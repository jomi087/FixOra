import { SalesReportInputDTO, SalesReportOutputDTO } from "../../../DTOs/SalesReportDTO";

export interface IGetSalesReportUseCase {
    execute(input:SalesReportInputDTO):Promise<SalesReportOutputDTO>
}