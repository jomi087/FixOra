import { RoleEnum } from "../enums/Roles";

export type DecodedUserToken = {
    id: string;
    email: string;
    role: RoleEnum;
    iat: number;
    exp: number;
};

export interface UploadedFile {
    buffer: Buffer;
    mimeType: string;
    size: number;
}


export type CallStatus = "accepted" | "rejected";
