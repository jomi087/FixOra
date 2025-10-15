import { RoleEnum } from "../../../shared/enums/Roles";

export interface SignOutDTO {
    userId: string;
    fcmToken: string | null
}

export interface SignOutInputDTO extends SignOutDTO {
    role: RoleEnum;
}


