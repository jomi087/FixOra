import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/ServiceInterface/ITokenService";

export class TokenService implements ITokenService {

    generateToken(payload: object, secret: string, expiry: string): string {
        const expiryTime = expiry as SignOptions["expiresIn"];
        return jwt.sign(payload, secret, { expiresIn: expiryTime });
    }

    verifyToken(token: string, secret:string ): any {
        return jwt.verify(token, secret);

    }

    generateAccessToken(payload: object): string {
        const expiryTime = process.env.JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: expiryTime });
    }

    generateRefreshToken(payload: object): string {
        const expiryTime = process.env.JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: expiryTime });
    }

    verifyAccessToken(token: string) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    }

    verifyRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    }
}
