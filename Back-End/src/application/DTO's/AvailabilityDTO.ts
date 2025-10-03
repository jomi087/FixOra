import { Day, LeaveOption } from "../../shared/types/availability";

export interface getAvailabilityOutputDTO {
    day: Day,
    slots: string[]
    active: boolean
}

export interface setAvailabilityInputDTO {
    schedule: Record<Day, { slots: string[], active: boolean }>;
    providerUserId: string
}

export interface setAvailabilityOutputDTO extends getAvailabilityOutputDTO { }

export interface toggleAvailabilityInputDTO {
    day: Day,
    providerUserId: string,
    leaveOption?: LeaveOption
}