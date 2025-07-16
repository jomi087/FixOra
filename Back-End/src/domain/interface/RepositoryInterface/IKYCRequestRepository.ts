import { KYCStatus } from "../../../shared/constant/KYCstatus.js";
import { KYCRequest } from "../../entities/KYCRequestEntity.js";

export interface IKYCRequestRepository {
    findByUserId(userId: string): Promise<KYCRequest | null>;
    create(data: KYCRequest): Promise<void>;
    update(userId: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>;
    
    // findById(id: string): Promise<KYCDTO | null>;
    // findAllPending(): Promise<KYCDTO[]>;
    // updateStatus(id: string, status: KYCStatus, reason?: string, reviewedBy?: string): Promise<void>;
    // deleteByUserId(userId: string): Promise<void>;
}


