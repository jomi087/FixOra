import { RoleEnum } from "../../shared/Enums/Roles.js";

export type SigninDTO = {
    email: string;
    role: RoleEnum;
    password: string;
}