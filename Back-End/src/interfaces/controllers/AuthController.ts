import { Request, Response } from "express";
import { SignupDTO } from "../../application/dtos/SignupDTO.js";
import { SignupUseCase } from "../../application/useCases/signupUseCase.js";

export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase //"the value comming from constructor will be an instance of the class SignupUseCase."
  ) { }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      console.log("enterd", req.body)
      const userData: SignupDTO = req.body;

      const token = await this.signupUseCase.execute(userData);

      res.cookie('tempToken', token, {
        httpOnly: true,
        secure: process.env.NODE_COOKIE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
        sameSite: "lax",
        maxAge: 5 * 60 * 1000
      })

      res.status(200).json({
          success: true,
          message: "OTP sent to your email",
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void>{
    try {
      //logic get otp from front end
      //get email from jwt  and
      //  find the wether there such  email and otp exist or not
      //  if not the otp has expired  guide towards re-send otp 
      //  else if yes and the otp are same then redirect to home page and save the data from jwt to db  
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({success:false, message : 'Internal server error'})
    }
  }
}