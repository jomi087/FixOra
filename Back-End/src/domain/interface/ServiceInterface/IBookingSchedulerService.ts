
export interface IBookingSchedulerService {
    scheduleTimeoutJob(
        jobKey: string,
        bookingId: string,
        timeoutMs: number,
        onExpire: () => Promise<void>
    ): void;

    cancel(jobKey: string): void;
}



