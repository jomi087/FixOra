import { SalesReportInputDTO, SalesReportOutputDTO } from "../../../dtos/SalesReportDTO";

export interface IGetSalesReportUseCase {
    execute(input:SalesReportInputDTO):Promise<SalesReportOutputDTO>
}