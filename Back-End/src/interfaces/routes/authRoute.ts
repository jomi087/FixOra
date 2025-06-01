import express from 'express'
const router = express.Router();

import { UserRepository } from '../../infrastructure/database/repositories/UserRepository.js';
import { OtpRepository } from '../../infrastructure/database/repositories/OtpRepository.js';
import { EmailService } from '../../infrastructure/services/EmailService.js';
import { OtpGenratorservice } from '../../infrastructure/services/OtpGeneratorService.js';
import { HashService } from '../../infrastructure/services/HashService.js';

// Instantiate all dependencies
const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const emailService = new EmailService();
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();

import { SignupUseCase } from '../../application/useCases/signupUseCase.js';
const signupUseCase = new SignupUseCase( //
    userRepository,
    otpRepository,
    emailService,
    otpGenratorservice,
    hashService
) 


import { AuthController } from '../controllers/AuthController.js';
const authController = new AuthController(signupUseCase) 

// router.post('/signup' ,  authController.signup ) //! This will not wrk (reson metioned below)
router.post('/signup', (req, res) => authController.signup(req, res))


export default router

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
