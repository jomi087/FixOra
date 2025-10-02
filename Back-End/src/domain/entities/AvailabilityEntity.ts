import { Day } from "../../shared/types/availability";

export interface DaySchedule {
    day: Day,
    slots: string[];
    active: boolean; 
}
export interface Availability {
    providerId: string,   
    workTime: DaySchedule[],
    createdAt: Date;
    updatedAt?: Date;
}
