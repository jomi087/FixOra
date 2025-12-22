import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../../dto/booking/BookingHistoryDTO";

export interface IBookingHistoryUseCase {
  execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO>;
}
