import { Booking } from "../../../domain/entities/BookingEntity";
import { PaginationInputDTO, PaginationOutputDTO } from "../Common/PaginationDTO";


export interface BookingHistoryInputDTO extends Omit<PaginationInputDTO, "searchQuery" | "filter"> {
    userId: string;
}

export interface BookingHistoryOutputDTO extends PaginationOutputDTO<Pick<Booking, "bookingId" | "scheduledAt" | "status" >> {}



export interface JobHistoryInputDTO extends Omit<PaginationInputDTO, "searchQuery" | "filter"> {
    providerUserId: string;
}

export interface JobHistoryOutputDTO extends PaginationOutputDTO<Pick<Booking, "bookingId" | "scheduledAt" | "status" >>{}