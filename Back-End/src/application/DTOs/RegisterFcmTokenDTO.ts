import { Platforms } from "../../shared/types/platforms";

export interface RegisterFcmTokenInputDTO {
    userId: string;
    FcmToken: string;
    platform: Platforms
}