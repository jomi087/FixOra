import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../../dtos/BookingDTO/BookingHistoryDTO";

export interface IBookingHistoryUseCase {
  execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO>;
}
