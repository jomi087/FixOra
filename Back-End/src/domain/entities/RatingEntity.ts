export interface Rating {
    bookingId:string
    providerId: string;    
    userId: string;      
    rating: number;      
    feedback: string;       
    createdAt: Date;
    updatedAt?: Date;
}
 