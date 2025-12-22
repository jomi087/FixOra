import { Category } from "../../entities/CategoryEntity";
import { KYCRequest } from "../../entities/KYCRequestEntity";
import { User } from "../../entities/UserEntity";

export interface IKYCRequestRepository {
    findByUserId(userId: string): Promise<KYCRequest | null>;
    findById(id: string): Promise<KYCRequest | null>
    create(data: KYCRequest): Promise<void>;
    updateById(id: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>;
    updateByUserId(userId: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>;

    findWithFilters(
        option: { searchQuery: string; filter: string },
        currentPage: number, limit: number
    ): Promise<{
        data: {
            id: string;
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location" >
            kycInfo: Omit<KYCRequest, "userId" | "serviceId" | "specialixationIds" >
            category: Partial<Category>
        }[];
        total: number
    }>;
}

