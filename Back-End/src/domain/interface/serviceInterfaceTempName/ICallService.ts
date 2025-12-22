export interface ICallService {
    sendCallAccepted(to: string, payload: Record<string,unknown>): void;
    sendCallRejected(to: string, payload: Record<string,unknown>): void;
}

