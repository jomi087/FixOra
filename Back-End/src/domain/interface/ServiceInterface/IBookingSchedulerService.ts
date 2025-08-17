
export interface IBookingSchedulerService {
    scheduleAutoReject(
        jobKey: string,
        bookingId: string,
        timeoutMs: number,
        onExpire: () => Promise<void>
    ): void;

    cancel(jobKey: string): void;
}
