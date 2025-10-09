import axios from "axios";
import { GoogleTokenResponse, GoogleUserInfo, IGoogleOAuthService } from "../../domain/interface/ServiceInterface/IGoogleOAuthService";


export class GoogleOAuthService implements IGoogleOAuthService {

    async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {   
    
        const params = new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: "postmessage",
            grant_type: "authorization_code",
        });

        const response = await axios.post("https://oauth2.googleapis.com/token", params);
        return response.data as GoogleTokenResponse;
    }

    async getUserInfo(accessToken: string): Promise<GoogleUserInfo> { 
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data as GoogleUserInfo; 
    }
}
