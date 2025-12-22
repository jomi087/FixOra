import schedule, { Job } from "node-schedule";
import { IBookingSchedulerService } from "../../domain/interface/serviceInterfaceTempName/IBookingSchedulerService";

export class BookingSchedulerService implements IBookingSchedulerService {
    private jobs = new Map<string, Job>();

    scheduleTimeoutJob(jobKey: string, bookingId: string, timeoutMs: number, onExpire: () => Promise<void>): void {
        const expiryTime = new Date(Date.now() + timeoutMs);

        const job: Job = schedule.scheduleJob(expiryTime, async () => {
            try {
                await onExpire();
            } catch (err) {
                console.error(`[AutoRejectJob] Failed for booking ${bookingId}:`, err);
            } finally {
                this.cancel(jobKey);
            }
        });

        this.jobs.set(jobKey, job);
    }

    cancel(jobKey: string): void {
        const job = this.jobs.get(jobKey);
        if (job) {
            job.cancel();
            this.jobs.delete(jobKey);
        }
    }
}
