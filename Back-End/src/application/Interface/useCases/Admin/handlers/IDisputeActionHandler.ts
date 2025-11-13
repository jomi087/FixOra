import { Dispute } from "../../../../../domain/entities/DisputeEntity";
// import { ITransactionSession } from "../../../../../domain/interface/DatabaseInterface/ITransactionManager";

export interface IDisputeActionHandler {
    takeAction(dispute: Dispute, /*txSession?: ITransactionSession*/ ): Promise<void>;
}