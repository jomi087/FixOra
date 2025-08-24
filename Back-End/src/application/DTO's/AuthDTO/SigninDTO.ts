import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { AddressDTO } from "../Common/AddressDTO.js";

export type SigninInputDTO = {
    email: string;
    role: RoleEnum;
    password: string;
}

export type SignInOutputDTO  = {
    userData: {
        fname: string;
        lname?: string;
        email: string;
        mobileNo?: string;
        role: RoleEnum;
        location?: AddressDTO;
    };
    accessToken: string;
    refreshToken: string;
}
