import { RoleEnum } from "../../../shared/Enums/Roles";
import { AddressDTO } from "../Common/AddressDTO";

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
