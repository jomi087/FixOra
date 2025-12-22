import { Dispute } from "../../../../../domain/entities/DisputeEntitytemp";
// import { ITransactionSession } from "../../../../../domain/interface/databaseInterface/ITransactionManager";

export interface IDisputeActionHandler {
    takeAction(dispute: Dispute, /*txSession?: ITransactionSession*/ ): Promise<void>;
}