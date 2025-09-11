import { RoleEnum } from "../../../shared/Enums/Roles";
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
    findByUserGoogleId(googleId: string): Promise<User | null>;
    updateRole(userId: string, role: RoleEnum, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
    
    updateProfie(userId: string,
        updateData: Pick<User, "fname" | "lname" | "mobileNo" | "location">
    ): Promise<Pick<User, "fname" | "lname" | "mobileNo" | "location">>

    toogleUserStatusById(userId: string, isBlocked: boolean): Promise<boolean>;
    updateRefreshTokenAndGetUser(userId: string, refreshToken: string): Promise<Omit<User, "password"> | null>;
    resetRefreshTokenById(userId: string, refreshToken?: string): Promise<boolean>;
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
            category: Pick<Category, "categoryId" | "name" | "subcategories" >
            averageRating: number,
            totalRatings: number
        }[];
        total: number
    }>

    findProviderInfoById(providerId: string , coordinates: { latitude: number;longitude: number }): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
        booking: Pick<Booking, "bookingId" | "scheduledAt"| "status">[]
        distanceFee: number
    }>

    getServiceChargeWithDistanceFee(providerId: string, coordinates: { latitude: number; longitude: number }): Promise<{serviceCharge : number , distanceFee :number}|null>

}

/*
    This is how wrote first 
    export interface IUserRepository {
        findByEmail(email: string): Promise <User | null>;
        create(user: User): Promise <void>;

        findByUserId(userId: string): Promise<Omit<User, "password" | "refreshToken"> | null>;
        update(userId:string , updates: Partial<User>) :Promise<Omit <User, "password"|"refreshToken" > | null>
    }
    but there was issue like 
        * design and scalability issues (Your interface is deciding what data to hide (like password) — that’s something your use case or controller should decide, not the interface.)
        * It Becomes Hard to Reuse What if another use case needs the password (e.g., for login) You’d have to write a new method or change this one, which is messy.

        * It Breaks Clean Architecture Rules - Violates Single Responsibility Principle (SRP) Interfaces should define what the repository does  that the responsibilty of interface , it is not supposed to care about how data is shown or hidden. That logic belongs in the repository implementation or the use case, not here.
        * Breaks Liskov Substitution Principle (LSP)- If you implement this interface in another context (e.g., with a different DB or mock), your mock might not care about projection — but it still has to mimic this exact structure.

        so either i could wirte the way to jst fetch the data but in some time i dont need the full data that y i am doing it dynamicaly way 
*/