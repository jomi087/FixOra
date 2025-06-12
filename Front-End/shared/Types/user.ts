import type { RoleEnum } from "../enums/roles";

export type Credentials = {
    email: string;
    password: string;
};

export type User = {
    fname: string;
    lname: string;
    email: string;
    mobileNo: string;
};

export type Signup = User & {
    password: string;
    cPassword: string;
};

export type Signin = Credentials & {
    role: RoleEnum;
};
