import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../../DTO's/BookingDTO/BookingHistoryDTO";

export interface IBookingHistoryUseCase {
  execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO>;
}
