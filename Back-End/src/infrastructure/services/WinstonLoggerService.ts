import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";
import { loggerInstance } from "../logger/config.js";

export class WinstonLogger implements ILoggerService {
    info(message: string, meta?: any): void {
        loggerInstance.info(message, meta);
    }
    warn(message: string, meta?: any): void {
        loggerInstance.warn(message, meta);
    }
    error(message: string, meta?: any): void {
        loggerInstance.error(message, meta);
    }
}
