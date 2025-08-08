export interface BookingDTO{
    userId: string;
    providerId: string
    providerUserId : string
    fullDate: string;
    time: string;
    issueTypeId: string;
    issue: string;
}

export interface BookingInputDTO extends BookingDTO { }

export interface BookingOutputDTO {
    bookingId: string;
    user: {
        userId: string;
        fname: string;
        lname: string;
    },
    provider: {
        providerId: string;
        providerUserId: string;
        fname: string;
        lname: string;

    }
    issueType: {
        issueTypeId: string;
        name : string
    }
    fullDate: string;
    time: string;
    issue: string;
}