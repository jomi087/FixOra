import { NextFunction, Request, Response } from "express";

//api logic
import { SignupDTO } from "../../application/InputDTO's/SignupDTO.js";
import { SignupUseCase } from "../../application/useCases/auth/SignupUseCase.js";
import { VerifySignupOtpUseCase } from "../../application/useCases/auth/VerifySignupOtpUseCase.js";
import { ResendOtpUseCase } from "../../application/useCases/auth/ResendOtpUseCase.js";
import { SigninUseCase } from "../../application/useCases/auth/SigninUseCase.js";
import { SigninDTO } from "../../application/InputDTO's/SigninDTO.js";
import { RefreshTokenUseCase } from "../../application/useCases/auth/RefreshTokenUseCase.js";
import { SignoutUseCase } from "../../application/useCases/auth/SignoutUseCase.js";
import { ForgotPasswordUseCase } from "../../application/useCases/auth/ForgotPasswordUseCase.js";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase.js";
import { GoogleSigninUseCase } from "../../application/useCases/auth/GoogleSigninUseCase.js";


export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase, //"the value comming from constructor will be an instance of the class SignupUseCase."
    private verifySignupOtpUseCase: VerifySignupOtpUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private signinUseCase: SigninUseCase,
    private googleSigninUseCase : GoogleSigninUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase : ResetPasswordUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private signoutUseCase : SignoutUseCase
  ) { }

  async signup(req: Request, res: Response, next : NextFunction ): Promise<void> {
    try {
      const userData: SignupDTO = req.body;
      const tempToken = await this.signupUseCase.execute(userData);

      res.cookie('tempToken', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
        sameSite: "lax",
        maxAge: 10* 60 * 1000 // temp token  for 10 mints  
      })

      res.status(200).json({
          success: true,
        message: "OTP sent to your mail",
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      next(error);
    }
  }

  async verifySignupAc(req: Request, res: Response, next : NextFunction ): Promise<void>{
    try {
      const {otpData} = req.body;
      
      const tempToken = req.cookies.tempToken 
      await this.verifySignupOtpUseCase.execute(otpData,tempToken)
      
      res.clearCookie("tempToken")

      res.status(200).json({
        success: true,
        message: "Account Created SuccessFully"
      });

    } catch (error: any) {
      console.error("Signup verification error:", error);
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const tempToken = req.cookies.tempToken
      await this.resendOtpUseCase.execute(tempToken)

      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });

    } catch (error) {
      console.error("resendOtp error:", error);
      next(error);
    }
  }

  async googleSignin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { code, role } = req.body;
      if (!code || !role) throw { status: 400, message: "Token(code) is missing" };
      
      const result = await this.googleSigninUseCase.execute(code,role)

      res
        .status(200)
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_COOKIE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_COOKIE_ENV === "production", 
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: "Singin Successful",
          userData: result.userData,
        });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const credentials: SigninDTO = req.body
      const result = await this.signinUseCase.execute(credentials)

      res
        .status(200)
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: "Singin Successful",
          userData: result.userData,
        });
      
    } catch(error) {
      console.log("signin error", error);
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body
      await this.forgotPasswordUseCase.execute(email)  // this use case is  were i am checking  do the given email exist in the usredb  if yes then send otp

      res.status(200).json({
        sucess: true,
        message : "Verification mail sent to your mail"
      })

    } catch (error:any) {
      console.error("ForgotPassword error:", error);
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { token, password } = req.body
      
      await this.resetPasswordUseCase.execute(token, password)

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });

    } catch (error: any) {
      console.error("verifyOtp error:", error);
      next(error);
    }
    
  }

  async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw { status: 401, message: "Not authenticated" };
      }
      res.status(200).json({
        success: true,
        user: {
          fname: req.user.fname,
          lname: req.user.lname,
          email: req.user.email,
          mobileNo: req.user.mobileNo,
          role: req.user.role,
          location : req.user?.location,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request , res: Response, next: NextFunction): Promise<void>{
    try {
      const oldRefreshToken = req.cookies.refreshToken 
      const { accessToken, refreshToken } = await this.refreshTokenUseCase.execute(oldRefreshToken)

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production",
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

      res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully"
      });

    } catch (error:any) {
      console.error("Refresh token error:", {
        error: error.message,
        status: error.status,
        timestamp: new Date().toISOString()
      });

      // Clear tokens on error
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production",
        sameSite: "lax" as const,
        // path: "/"
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
        throw { status : 400, message : "user or role is missing, refresh again"}
      }

      await this.signoutUseCase.execute( userId )

      const options  = {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production",
        sameSite: "lax" as const
      }
      
      res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({ message: "Logged Out" })
      
    } catch (error) {
      console.log("signout error", error);
      next(error);
    }
  }

}