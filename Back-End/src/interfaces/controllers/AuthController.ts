import { NextFunction, Request, Response } from "express";

//api logic
import { SignupDTO } from "../../application/dtos/AuthDTO/SignupDTO";
import { SigninInputDTO } from "../../application/dtos/AuthDTO/SigninDTO";
import { HttpStatusCode } from "../../shared/enumss/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
import { IVerifySignupOtpUseCase } from "../../application/Interface/useCases/auth/IVerifySignupOtpUseCase";
import { IResendOtpUseCase } from "../../application/Interface/useCases/auth/IResendOtpUseCase";
import { ISigninUseCase } from "../../application/Interface/useCases/auth/ISigninUseCase";
import { IGoogleSigninUseCase } from "../../application/Interface/useCases/auth/IGoogleSigninUseCase";
import { IForgotPasswordUseCase } from "../../application/Interface/useCases/auth/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../application/Interface/useCases/auth/IResetPasswordUseCase";
import { IRefreshTokenUseCase } from "../../application/Interface/useCases/auth/IRefreshTokenUseCase";
import { ISignoutUseCase } from "../../application/Interface/useCases/auth/ISignoutUseCase";
import { ISignupUseCase } from "../../application/Interface/useCases/auth/ISignupUseCase";
import { IRegisterFcmTokenUseCase } from "../../application/Interface/useCases/auth/IRegisterFcmTokenUseCase";
import jwt from "jsonwebtoken";
import { DecodedUserDTO } from "../../application/dtos/AuthDTO/DecodedUserDTO";
import { AppError } from "../../shared/errors/AppError";

const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
const { UNAUTHORIZED_MSG, OTP_SENT, ACCOUNT_CREATED_SUCCESS,
    SIGNIN_SUCCESSFUL, MISSING_TOKEN, VERIFICATION_MAIL_SENT, NOT_FOUND_MSG,
    LOGGED_OUT, PASSWORD_RESET_SUCCESS
} = Messages;


export class AuthController {
    constructor(
        private _signupUseCase: ISignupUseCase, //"the value comming from constructor will be an instance of the class SignupUseCase."
        private _verifySignupOtpUseCase: IVerifySignupOtpUseCase,
        private _resendOtpUseCase: IResendOtpUseCase,
        private _signinUseCase: ISigninUseCase,
        private _googleSigninUseCase: IGoogleSigninUseCase,
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
        private _registerFcmTokenUseCase: IRegisterFcmTokenUseCase,
        private _refreshTokenUseCase: IRefreshTokenUseCase,
        private _signoutUseCase: ISignoutUseCase
    ) { }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData: SignupDTO = req.body;
            const tempToken = await this._signupUseCase.execute(userData);

            res.cookie("tempToken", tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
                sameSite: "lax",
                maxAge: 10 * 60 * 1000 // temp token  for 10 mints  
            });

            res.status(OK).json({
                success: true,
                message: OTP_SENT,
            });

        } catch (error) {
            next(error);
        }
    }

    async verifySignupAc(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otpData } = req.body;

            const tempToken = req.cookies.tempToken;
            await this._verifySignupOtpUseCase.execute(otpData, tempToken);

            res.clearCookie("tempToken");

            res.status(OK).json({
                success: true,
                message: ACCOUNT_CREATED_SUCCESS
            });

        } catch (error) {
            next(error);
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            let email: string;

            if (req.cookies.tempToken) {
                const tempToken = req.cookies.tempToken;
                const decodeUserData = jwt.verify(tempToken, process.env.JWT_TEMP_ACCESS_SECRET as string) as DecodedUserDTO;
                email = decodeUserData.email;

            } else if (req.body.email) {
                email = req.body.email;
            } else {
                throw new AppError(FORBIDDEN, NOT_FOUND_MSG("Email"));
            }

            await this._resendOtpUseCase.execute(email);

            res.status(OK).json({
                success: true,
                message: OTP_SENT,
            });

        } catch (error) {
            next(error);
        }
    }

    async googleSignin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { code, role } = req.body;
            if (!code || !role) throw new AppError(BAD_REQUEST, MISSING_TOKEN("google"));

            const result = await this._googleSigninUseCase.execute(code, role);

            res
                .status(OK)
                .cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                .cookie("refreshToken", result.refreshToken, {
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
        } catch (error) {
            next(error);
        }

    }

    async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentials: SigninInputDTO = req.body;
            const result = await this._signinUseCase.execute(credentials);

            res
                .status(OK)
                .cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                .cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                .json({
                    success: true,
                    message: SIGNIN_SUCCESSFUL,
                    userData: result.userData,
                });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            await this._forgotPasswordUseCase.execute(email);  // this use case is  were i am checking  do the given email exist in the usredb  if yes then send otp

            res.status(OK).json({
                sucess: true,
                message: VERIFICATION_MAIL_SENT
            });

        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { token, password } = req.body;

            await this._resetPasswordUseCase.execute(token, password);

            res.status(OK).json({
                success: true,
                message: PASSWORD_RESET_SUCCESS,
            });

        } catch (error) {
            next(error);
        }

    }

    async registerFcmToken(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            const { FcmToken, platform } = req.body;
            await this._registerFcmTokenUseCase.execute({ userId, FcmToken, platform });

            res.status(200).json({ message: "FCM token saved" });
        } catch (error) {
            next(error);
        }
    }

    async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            res.status(OK).json({
                success: true,
                user: {
                    userId: req.user.userId,
                    fname: req.user.fname,
                    lname: req.user.lname,
                    email: req.user.email,
                    mobileNo: req.user.mobileNo,
                    role: req.user.role,
                    location: req.user?.location,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const oldRefreshToken = req.cookies.refreshToken;
            const { accessToken, refreshToken } = await this._refreshTokenUseCase.execute(oldRefreshToken);

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const,
            };

            res.cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(OK).json({
                success: true,
            });

        } catch (error) {

            // Clear tokens on error
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const,
            };

            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            next(error);
        }
    }

    async signout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.userId;   //req.user gives the userData  ( user: Omit<User, "password" | "refreshToken"> | null)
            const role = req.user?.role;
            const { fcmToken } = req.body as { fcmToken: string | null };

            if (!userId || !role) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);

            await this._signoutUseCase.execute({ userId, role, fcmToken });

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const
            };

            res.status(OK)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({ message: LOGGED_OUT });

        } catch (error) {
            next(error);
        }
    }

}