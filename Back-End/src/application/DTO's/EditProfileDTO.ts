import { AddressDTO } from "./Common/AddressDTO";

export interface EditProfileInputDTO {
    userId: string;
    profileData: {
        fname: string;
        lname: string;
        mobile: string;
        location: AddressDTO;
    };
}

export interface ProfileDTO {
    fname: string;
    lname: string;
    mobileNo: string;
    location: AddressDTO;
}


export interface UpdatedProfileOutputDTO {
    data: ProfileDTO;
}

