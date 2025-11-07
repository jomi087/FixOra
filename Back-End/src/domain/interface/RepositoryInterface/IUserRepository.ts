import { RoleEnum } from "../../../shared/enums/Roles";
import { Availability } from "../../entities/AvailabilityEntity";
import { Booking } from "../../entities/BookingEntity";
import { Category } from "../../entities/CategoryEntity";
import { Provider } from "../../entities/ProviderEntity";
import { User } from "../../entities/UserEntity";

//!Bad Practice in this repository (update)(i am violating srp rule need to re-work)

export interface IUserRepository {
    findByEmail(email: string, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;

    create(user: User): Promise<User>;

    delete(userId: string): Promise<void>;

    findByUserId(userId: string, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;

    findUserEmail(userId:string):Promise<string|null>

    findByUserGoogleId(googleId: string): Promise<User | null>;

    updateRole(userId: string, role: RoleEnum, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;

    updateProfie(userId: string,
        updateData: Pick<User, "fname" | "lname" | "mobileNo" | "location">
    ): Promise<Pick<User, "fname" | "lname" | "mobileNo" | "location">>

    toogleUserStatusById(userId: string, isBlocked: boolean): Promise<boolean>;
    updateRefreshTokenAndGetUser(userId: string, refreshToken: string): Promise<Omit<User, "password"> | null>;
    resetRefreshTokenById(userId: string, refreshToken?: string): Promise<boolean>;

    clearTokensById(userId: string, fcmToken: string): Promise<boolean>;

    resetPasswordByEmail(email: string, password: string): Promise<boolean>;

    findUsersWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
    ): Promise<{ data: Partial<User>[]; total: number }>;

    findActiveProvidersWithFilters(
        option: {
            searchQuery: string;
            filter: string
            extraFilter?: {
                selectedService?: string;
                nearByFilter?: string;
                ratingFilter?: number;
                availabilityFilter?: string;
            },
            coordinates: {
                latitude: number;
                longitude: number;
            }
        },
        currentPage: number, limit: number
    ): Promise<{
        data: {
            user: Pick<User, "userId" | "fname" | "lname">,
            provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
            category: Pick<Category, "categoryId" | "name" | "subcategories">
            averageRating: number,
            totalRatings: number
        }[];
        total: number
    }>

    findProviderInfoById(providerId: string, coordinates: { latitude: number; longitude: number }): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
        booking: Pick<Booking, "bookingId" | "scheduledAt" | "status">[]
        availability: Pick<Availability, "workTime">
        distanceFee: number
    }>

    getServiceChargeWithDistanceFee(providerId: string, coordinates: { latitude: number; longitude: number }): Promise<{ serviceCharge: number, distanceFee: number } | null>

    findByRole(Role: RoleEnum): Promise<User[]>

    //removeFcmToken
    addFcmToken(userId: string, FcmToken: string, platform?: string): Promise<any>

    dashboardUserStats(start: Date, end: Date): Promise<{
        totalCustomers: number;
        blockedCustomers: number;
        newCustomers: number;
        totalProviders: number;
        blockedProviders: number;
        newProviders: number;
    }>
}
