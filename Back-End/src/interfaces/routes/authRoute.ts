import express from "express";
const router = express.Router();

import { validateRequest } from "../middleware/validateRequest";
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema } from "../validations/authSchema";

import { authController, AuthMiddleware } from "../../main/dependencyInjector";
import { RoleEnum } from "../../shared/enums/Roles";
import { fcmSchema } from "../validations/fcmTokenSchema";
import { mediumRateLimit, strictRateLimit } from "../../infrastructure/security/rateLimiters";


router.post("/signup", strictRateLimit, validateRequest(signupSchema), (req, res,next) => authController.signup(req, res, next));
router.post("/verify-otp", strictRateLimit, (req, res, next) => authController.verifySignupAc(req, res, next));
router.post("/resend-otp", strictRateLimit, (req, res, next) => authController.resendOtp(req, res, next));

router.post("/signin", strictRateLimit, validateRequest(signinSchema), (req, res, next) => authController.signin(req, res, next));

router.post("/google-signin", strictRateLimit, (req, res, next) => authController.googleSignin(req, res, next));
router.post("/forgot-password", strictRateLimit, validateRequest(forgotPasswordSchema), (req, res, next)=> authController.forgotPassword(req, res, next));
router.patch("/reset-password", strictRateLimit, validateRequest(resetPasswordSchema), (req, res, next)=> authController.resetPassword(req, res, next));

router.post("/register-fcm-token", validateRequest(fcmSchema), AuthMiddleware([RoleEnum.Provider]), (req, res, next) => authController.registerFcmToken(req, res, next));

router.get("/check", mediumRateLimit, AuthMiddleware(), (req, res, next) => authController.checkAuth(req, res, next));
router.post("/refresh-token", strictRateLimit, (req, res, next) => authController.refreshToken(req, res, next));
router.post("/signout", mediumRateLimit, AuthMiddleware(), (req,res,next)=> authController.signout(req, res, next));

export default router;

/*----------------------------------------------------------------------------
//?          router.post('/signup', authController.signup)
 This will not work because the method is passed as a reference without binding.
 So the `this` context inside `signup` will be undefined or incorrect when Express calls it.

 This issue is specific to **class methods**, where `this` refers to the instance.
 Express calls the handler like: signup(req, res), not as authController.signup(req, res),
 which breaks `this`-dependent logic inside the method.

  However, directly invoking the method like:
 authController.signup() owere here  will work correctly, because `this` is preserved at the time of invocation.
*/

//#                Thats y i have written like this
//*   router.post('/signup', (req, res) => authController.signup(req, res));
//#                       another way
//*  router.post('/signup', authController.signup.bind(authController))

/*----------------------------------------------------------------------------
This is how router was, but the issue ower here was, inteface was depending to the outer layer( infrastructure layer ) 
eg  -> "import { UserRepository } from '../../infrastructure/database/repositories/UserRepository
thats my Di (dipendency injector) file was creatd in the outter area and all DI code we move from here to di file


import express from 'express'
const router = express.Router();

import { validateRequest } from '../middleware/validateRequest
import { signupSchema } from '../validations/signupSchema
import { signinSchema } from '../validations/signinSchema


import { UserRepository } from '../../infrastructure/database/repositories/UserRepository
import { OtpRepository } from '../../infrastructure/database/repositories/OtpRepository
import { EmailService } from '../../infrastructure/services/EmailService
import { OtpGenratorservice } from '../../infrastructure/services/OtpGeneratorService
import { HashService } from '../../infrastructure/services/HashService
import { TokenService } from '../../infrastructure/services/TokenService
import { RefreshTokenUseCase } from '../../application/useCases/RefreshTokenUseCase


// Instantiate all dependencies
const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const emailService = new EmailService(); 
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();
const tokenService = new TokenService()


import { SignupUseCase } from '../../application/useCases/SignupUseCase
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService ) 

import { VerifySignupOtpUseCase } from '../../application/useCases/VerifySignupOtpUseCase
const verifySignupOtpUseCase = new VerifySignupOtpUseCase(otpRepository, userRepository)

import { ResendOtpUseCase } from '../../application/useCases/ResendOtpUseCase
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService)

// Used a Role Strategy Map for signin (single singin for all roles)
import { configureAuthStrategies } from '../../infrastructure/config/authConfig
const authFactory = configureAuthStrategies(userRepository, hashService)
import { SigninUseCase } from '../../application/useCases/SigninUseCase
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository)

const refreshTokenUseCase = new RefreshTokenUseCase(tokenService)

import { AuthController } from '../controllers/AuthController
import { userAuth } from '../middleware/AuthMiddleware

const authController = new AuthController(signupUseCase, verifySignupOtpUseCase,resendOtpUseCase,signinUseCase,refreshTokenUseCase) 

router.post('/signup', validateRequest(signupSchema), (req, res,next) => authController.signup(req, res, next))
router.post('/verify-otp', (req, res, next) => authController.verifyAc(req, res, next))
router.get('/resend-otp', (req, res, next) => authController.resendOtp(req, res, next))
router.post('/signin', validateRequest(signinSchema), (req, res,next) => authController.signin(req, res, next) )
router.post('/refresh-token',(req,res,next) => authController.refreshToken(req,res,next))
export default router

*/


/*
this 1 case 
1. Preventing refresh logic from running when user is not logged in

Even if the user is not logged in, the refresh token logic is triggered, causing unnecessary logout dispatch and errors.

Your Axios interceptor tries to refresh tokens whenever it gets a 403 response.

But unauthenticated users (like new visitors or signed-out users) don't have tokens, so the refresh call fails, and then logout() is called — which is not needed.


*/