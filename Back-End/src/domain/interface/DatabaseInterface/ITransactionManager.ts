export interface ITransactionSession {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    end(): Promise<void>;
}


export interface ITransactionManager {
    start(): Promise<ITransactionSession>;
}
