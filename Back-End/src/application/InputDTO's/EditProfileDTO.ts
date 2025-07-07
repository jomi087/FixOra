import { AddressInputDTO } from "./AddressInputDTO.js";

export type EditProfileDTO = {
    fname: string;
    lname: string;
    mobile: string;
    location: AddressInputDTO
}