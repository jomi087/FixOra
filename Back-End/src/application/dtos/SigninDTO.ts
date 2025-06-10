import { RoleEnum } from "../../domain/constant/Roles.js";

export type SigninDTO = {
    email: string;
    role: RoleEnum;
    password: string;
}