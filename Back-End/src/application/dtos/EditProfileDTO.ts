import { AddressDTO } from "./AddressDTO.js";

export type EditProfileDTO = {
    fname: string;
    lname: string;
    mobile: string;
    location: AddressDTO
}