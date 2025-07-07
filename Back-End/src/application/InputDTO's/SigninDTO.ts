import { RoleEnum } from "../../shared/constant/Roles.js";

export type SigninDTO = {
    email: string;
    role: RoleEnum;
    password: string;
}