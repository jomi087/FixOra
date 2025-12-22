import { RoleEnum } from "../../../shared/enumss/Roles";
import { AddressDTO } from "../Common/AddressDTO";

export type SigninInputDTO = {
    email: string;
    role: RoleEnum;
    password: string;
}

export type SignInOutputDTO  = {
    userData: {
        userId: string;
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
