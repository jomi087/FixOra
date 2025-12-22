import { BookingStatus } from "../../shared/enums/BookingStatus";
import { FileData } from "./Common/FileDataDTO";

export interface WorkCompletionInputDTO {
    bookingId: string,
    plainFiles: FileData[]
    diagnose: string,
    parts: {
        name: string;
        cost: string|number;
    }[]
}

export interface WorkCompletionOutputDTO {
    status: BookingStatus
    workProofUrls: string[]
    diagnosed: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number;
        }[]
    }
}