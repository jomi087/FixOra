import { NextFunction, Request, Response } from "express";

//api logic
import { SignupDTO } from "../../application/dtos/SignupDTO.js";
import { SignupUseCase } from "../../application/useCases/SignupUseCase.js";
import { OtpVerifyDTO } from "../../application/dtos/OtpVerifyDTO.js";
import { VerifyAcUseCase } from "../../application/useCases/VerifyAcUseCase.js";
import { ResendOtpUseCase } from "../../application/useCases/ResendOtpUseCase.js";
import { SigninUseCase } from "../../application/useCases/SigninUseCase.js";
import { SigninDTO } from "../../application/dtos/SigninDTO.js";
import { RefreshTokenUseCase } from "../../application/useCases/RefreshTokenUseCase.js";



export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase, //"the value comming from constructor will be an instance of the class SignupUseCase."
    private verifyAcUseCase: VerifyAcUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private signinUseCase: SigninUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) { }

  async signup(req: Request, res: Response, next : NextFunction ): Promise<void> {
    try {
      const userData: SignupDTO = req.body;
      const result = await this.signupUseCase.execute(userData);

      res.cookie('tempToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
        sameSite: "lax",
        maxAge: 10 * 60 * 1000
      })

      res.status(200).json({
          success: true,
          message: result.message,
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      next(error);
    }
  }

  async verifyAc(req: Request, res: Response, next : NextFunction ): Promise<void>{
    try {
      const otpData: OtpVerifyDTO = req.body;
      
      const tempToken = req.cookies.tempToken
      const result = await this.verifyAcUseCase.execute(otpData,tempToken)
      
      res.clearCookie("tempToken")

      res.status(200).json({
        success: true,
        message: result.message,
      });

    }catch(error: any) {
      console.error("verifyOtp error:", error);
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const tempToken = req.cookies.tempToken
      const result = await this.resendOtpUseCase.execute(tempToken)

      res.status(200).json({
          success: true,
          message: result.message,
      });

    } catch (error) {
      console.error("resendOtp error:", error);
      next(error);
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
          maxAge:  1 * 24 * 60 * 60 * 1000 // 1 days
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
          success: true,
          message: result.message,
          userData: result.userData,
        });
      
    } catch(error) {
      console.log("signin error", error);
      next(error);
    }
  }

  async refreshToken(req: Request , res: Response, next: NextFunction): Promise<void>{
    try {
      const oldRefreshToken = req.cookies.refreshToken
      const { accessToken, refreshToken } = await this.refreshTokenUseCase.execute(oldRefreshToken)

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_COOKIE_ENV === "production",
        maxAge:  1 * 24 * 60 * 60 * 1000 // 1 days
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.status(200).json({ success: true });

    } catch (error) {
      console.log("signin error", error);
      next(error);
    }
  } 

}