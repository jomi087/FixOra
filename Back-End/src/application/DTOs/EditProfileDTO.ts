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


export interface UpdatedProfileOutputDTO extends ProfileDTO { }

export interface SelectedLocationInputDTO {
    userId: string,
    location: {
        address: string;
        lat: number;
        lng: number
    }
}