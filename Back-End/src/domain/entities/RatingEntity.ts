export interface Rating {
    providerId: string;    
    userId: string;      
    rating: number;      
    review?: string;       
    createdAt?: Date;
    updatedAt?: Date;
}
 