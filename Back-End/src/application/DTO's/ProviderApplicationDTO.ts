export interface ProviderApplicationDTO {
    id: string;
    user: {
        fname: string;
        lname: string;
        email: string;
        mobileNo: string;
        location: {
            houseinfo?: string;
            street?: string;
            district: string;
            city: string;
            locality: string;
            state: string;
            postalCode: string;
            Coordinates:{
                latitude: number;
                longitude: number;
            } 
        }
    };
    dob: Date;
    gender: string;
    serviceName: string;
    specializationNames: string[];
    profileImage: string;
    serviceCharge: number;
    kyc: {
            idCard: string;
            certificate: {
            education: string ;
            experience?: string;
        };
    };
    status: string;
    submittedAt: Date;
    reason?: string ;
    reviewedAt?: Date;
    reviewedBy?: string;
}

