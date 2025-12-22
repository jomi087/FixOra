import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../../dtos/booking/BookingHistoryDTO";

export interface IBookingHistoryUseCase {
  execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO>;
}
