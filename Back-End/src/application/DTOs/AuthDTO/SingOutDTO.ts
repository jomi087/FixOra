import { RoleEnum } from "../../../shared/enumss/Roles";

export interface SignOutDTO {
    userId: string;
    fcmToken: string | null
}

export interface SignOutInputDTO extends SignOutDTO {
    role: RoleEnum;
}


