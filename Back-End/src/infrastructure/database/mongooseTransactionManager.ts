import mongoose, { ClientSession } from "mongoose";
import { ITransactionManager, ITransactionSession } from "../../domain/interface/DatabaseInterface/ITransactionManager";

class MongooseTransactionSession implements ITransactionSession {
    constructor(private _session: ClientSession) {}

    async commit() {
        await this._session.commitTransaction();
    }

    async rollback() {
        await this._session.abortTransaction();
    }

    async end() {
        this._session.endSession();
    }

    get nativeSession(): ClientSession {
        return this._session;
    }
}

export class MongooseTransactionManager implements ITransactionManager {
    async start(): Promise<MongooseTransactionSession> {
        
        const session = await mongoose.startSession();
        session.startTransaction();
        return new MongooseTransactionSession(session);
    }
}
