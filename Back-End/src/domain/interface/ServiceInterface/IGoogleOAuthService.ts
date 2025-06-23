export interface IGoogleOAuthService {
  exchangeCodeForToken(code: string): Promise<any>;
  getUserInfo(accessToken: string): Promise<any>;
}