export interface ITokenService {
  generateToken(payload: object, secret: string, expiry: string): string
  verifyToken(token: string, secret: string): any

  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}

