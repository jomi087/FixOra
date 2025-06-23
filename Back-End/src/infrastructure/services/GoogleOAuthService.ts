import axios from 'axios';
import { IGoogleOAuthService } from '../../domain/interface/ServiceInterface/IGoogleOAuthService.js';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export class GoogleOAuthService implements IGoogleOAuthService {

  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {   
    
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "postmessage",
      grant_type: 'authorization_code',
    });

    const response = await axios.post('https://oauth2.googleapis.com/token', params);
    return response.data as GoogleTokenResponse
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> { 
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as GoogleUserInfo; 
  }
}
