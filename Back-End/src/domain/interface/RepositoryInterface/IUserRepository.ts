import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { Booking } from "../../entities/BookingEntity.js";
import { Category } from "../../entities/CategoryEntity.js";
import { Provider } from "../../entities/ProviderEntity.js";
import { User } from "../../entities/UserEntity.js";
import { UserDTO }  from "../../outputDTO's/UserDTO.js";

//!Bad Practice in this repository (update)(i am violating srp rule need to re-work)

export interface IUserRepository {
    create(user: UserDTO): Promise <User>;   
    findByEmail(email: string, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
    findByUserId(userId: string, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
    findByUserGoogleId(googleId: string, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
    
    updateRole(userId: string, role: RoleEnum, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
    
    updateProfie(userId: string,
        updateData: Pick<User, "fname" | "lname" | "mobileNo" | "location">
    ): Promise<Pick<User, "fname" | "lname" | "mobileNo" | "location">>

//split this method
    update(filter: Partial<Pick<User, "userId" | "email">>, updates: Partial<User>, omitFields?: Array<keyof User>): Promise<Partial<User> | null>;
//____________

    findUsersWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
        omitFields?: Array<keyof User>
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

    findProviderBookingsById(providerId: string , coordinates: { latitude: number;longitude: number }): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
        booking: Pick<Booking, "bookingId" | "fullDate" | "time" | "status">[]
        distanceFee: number
    }>
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