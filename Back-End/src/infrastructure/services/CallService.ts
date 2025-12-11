import { ICallService } from "../../domain/interface/ServiceInterface/ICallService";
import { getIO } from "../socket/config";

export class CallService implements ICallService {

    sendCallAccepted(to: string, payload: Record<string,unknown>): void {
        getIO().to(to).emit("zego:call:accepted", payload);
    }

    sendCallRejected(to: string, payload: Record<string,unknown>): void {
        getIO().to(to).emit("zego:call:rejected", payload);
    }
}
