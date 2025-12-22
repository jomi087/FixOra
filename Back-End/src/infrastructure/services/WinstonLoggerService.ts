import { ILoggerService } from "../../domain/interface/serviceInterface/ILoggerService";
import { loggerInstance } from "../logger/config";

export class WinstonLogger implements ILoggerService {
    info(message: string, meta?: unknown): void {
        loggerInstance.info(message, meta);
    }
    warn(message: string, meta?: unknown): void {
        loggerInstance.warn(message, meta);
    }
    error(message: string, meta?: unknown): void {
        loggerInstance.error(message, meta);
    }
    debug(message: string, meta?: unknown): void {
        loggerInstance.debug(message, meta);
    };
}
