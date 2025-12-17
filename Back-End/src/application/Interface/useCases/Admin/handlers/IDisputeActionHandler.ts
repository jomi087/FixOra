import { Dispute } from "../../../../../domain/entities/DisputeEntity";
// import { ITransactionSession } from "../../../../../domain/interface/databaseInterface/ITransactionManager";

export interface IDisputeActionHandler {
    takeAction(dispute: Dispute, /*txSession?: ITransactionSession*/ ): Promise<void>;
}