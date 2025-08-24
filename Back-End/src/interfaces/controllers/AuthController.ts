import { NextFunction, Request, Response } from "express";

//api logic
import { SignupDTO } from "../../application/DTO's/AuthDTO/SignupDTO.js";
import { SigninInputDTO } from "../../application/DTO's/AuthDTO/SigninDTO.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";
import { IVerifySignupOtpUseCase } from "../../application/Interface/useCases/Auth/IVerifySignupOtpUseCase.js";
import { IResendOtpUseCase } from "../../application/Interface/useCases/Auth/IResendOtpUseCase{.js";
import { ISigninUseCase } from "../../application/Interface/useCases/Auth/ISigninUseCase.js";
import { IGoogleSigninUseCase } from "../../application/Interface/useCases/Auth/IGoogleSigninUseCase.js";
import { IForgotPasswordUseCase } from "../../application/Interface/useCases/Auth/IForgotPasswordUseCase.js";
import { IResetPasswordUseCase } from "../../application/Interface/useCases/Auth/IResetPasswordUseCase.js";
import { IRefreshTokenUseCase } from "../../application/Interface/useCases/Auth/IRefreshTokenUseCase.js";
import { ISignoutUseCase } from "../../application/Interface/useCases/Auth/ISignoutUseCase.js";
import { ISignupUseCase } from "../../application/Interface/useCases/Auth/ISignupUseCase.js";

const { OK, BAD_REQUEST,UNAUTHORIZED } = HttpStatusCode;
const { UNAUTHORIZED_MSG, TOKENS_REFRESHED_SUCCESS, OTP_SENT, ACCOUNT_CREATED_SUCCESS,USER_NOT_FOUND,
  SIGNIN_SUCCESSFUL,MISSING_TOKEN,VERIFICATION_MAIL_SENT,LOGGED_OUT,PASSWORD_RESET_SUCCESS
 } = Messages;


export class AuthController {
  constructor(
    private _loggerService: ILoggerService,
    private _signupUseCase: ISignupUseCase, //"the value comming from constructor will be an instance of the class SignupUseCase."
    private _verifySignupOtpUseCase: IVerifySignupOtpUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _signinUseCase: ISigninUseCase,
    private _googleSigninUseCase : IGoogleSigninUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _resetPasswordUseCase : IResetPasswordUseCase,
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    private _signoutUseCase : ISignoutUseCase
  ) { }

  async signup(req: Request, res: Response, next : NextFunction ): Promise<void> {
    try {
      const userData: SignupDTO = req.body;
      const tempToken = await this._signupUseCase.execute(userData);

      res.cookie('tempToken', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
        sameSite: "lax",
        maxAge: 10* 60 * 1000 // temp token  for 10 mints  
      })

      res.status(OK).json({
        success: true,
        message: OTP_SENT,
      });

    } catch (error: any) {
      this._loggerService.error(`Signup error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async verifySignupAc(req: Request, res: Response, next : NextFunction ): Promise<void>{
    try {
      const {otpData} = req.body;
      
      const tempToken = req.cookies.tempToken 
      await this._verifySignupOtpUseCase.execute(otpData,tempToken)
      
      res.clearCookie("tempToken")

      res.status(OK).json({
        success: true,
        message: ACCOUNT_CREATED_SUCCESS
      });

    } catch (error: any) {
      this._loggerService.error(`Signup verification error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const tempToken = req.cookies.tempToken
      await this._resendOtpUseCase.execute(tempToken)

      res.status(OK).json({
        success: true,
        message: OTP_SENT,
      });

    } catch (error:any) {
      this._loggerService.error(`resendOtp error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async googleSignin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { code, role } = req.body;
      if (!code || !role) throw { status: BAD_REQUEST, message: MISSING_TOKEN  };
      
      const result = await this._googleSigninUseCase.execute(code,role)

      res
        .status(OK)
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", 
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: SIGNIN_SUCCESSFUL,
          userData: result.userData,
        });
    } catch (error:any) {
      this._loggerService.error(`googleSignin error:, ${error.message}`,{stack : error.stack});
      next(error)
    }
    
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const credentials: SigninInputDTO = req.body
      const result = await this._signinUseCase.execute(credentials)

      res
        .status(OK)
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: SIGNIN_SUCCESSFUL,
          userData: result.userData,
        });
    } catch(error:any) {
      this._loggerService.error(`signin error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body
      await this._forgotPasswordUseCase.execute(email)  // this use case is  were i am checking  do the given email exist in the usredb  if yes then send otp

      res.status(OK).json({
        sucess: true,
        message : VERIFICATION_MAIL_SENT
      })

    } catch (error:any) {
      this._loggerService.error(`ForgotPassword error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { token, password } = req.body
      
      await this._resetPasswordUseCase.execute(token, password)

      res.status(OK).json({
        success: true,
        message: PASSWORD_RESET_SUCCESS,
      });

    } catch (error: any) {
      this._loggerService.error(`verifyOtp error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
    
  }

  async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      if (!req.user) {
        throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
      }

      
      res.status(OK).json({
        success: true,
        user: {
          fname: req.user.fname,
          lname: req.user.lname,
          email: req.user.email,
          mobileNo: req.user.mobileNo,
          role: req.user.role,
          location: req.user?.location,
          
        }
      });
    } catch (error: any) {
      this._loggerService.error(`checkAuth error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

  async refreshToken(req: Request , res: Response, next: NextFunction): Promise<void>{
    try {
      const oldRefreshToken = req.cookies.refreshToken 
      const { accessToken, refreshToken } = await this._refreshTokenUseCase.execute(oldRefreshToken)

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
      };

      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.status(OK).json({
        success: true,
        message: TOKENS_REFRESHED_SUCCESS
      });

    } catch (error:any) {
      this._loggerService.error(`Refresh token error:, ${error.message}`,{stack : error.stack});

      // Clear tokens on error
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
      };

      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      next(error);
    }
  } 

  async signout(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {

      const userId  = req.user?.userId   //req.user gives the userData  ( user: Omit<User, "password" | "refreshToken"> | null)

      if (!userId ) {
        throw { status : BAD_REQUEST, message : USER_NOT_FOUND }
      }

      await this._signoutUseCase.execute( userId )

      const options  = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const
      }
      
      res.status(OK)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({ message : LOGGED_OUT })
      
    } catch (error:any) {
      this._loggerService.error(`signout error:, ${error.message}`,{stack : error.stack});
      next(error);
    }
  }

}