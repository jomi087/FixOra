
import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/interface/ServiceInterface/ITokenService.js';

export class TokenService implements ITokenService {

  generateAccessToken(payload: object):string{
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  }

  generateRefreshToken(payload: object):string{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string) {
     return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  verifyRefreshToken (token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  }
}
