import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../../DTOs/BookingDTO/BookingHistoryDTO";

export interface IBookingHistoryUseCase {
  execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO>;
}
