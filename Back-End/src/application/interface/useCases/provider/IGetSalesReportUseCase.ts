import { SalesReportInputDTO, SalesReportOutputDTO } from "../../../dto/SalesReportDTO";

export interface IGetSalesReportUseCase {
    execute(input:SalesReportInputDTO):Promise<SalesReportOutputDTO>
}