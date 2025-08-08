import { KYCRequest, KYCRequestWithDetails } from "../../entities/KYCRequestEntity.js";

export interface IKYCRequestRepository {
    findByUserId(userId: string): Promise<KYCRequest | null>;
    findById(id:string):Promise<KYCRequest | null>
    create(data: KYCRequest): Promise<void>;
    updateById(id: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>;
    updateByUserId(userId: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>;
    
    findWithFilters(
        option: { searchQuery: string; filter: string },
        currentPage: number, limit: number
    ): Promise<{ data: KYCRequestWithDetails []; total: number }>;
}
