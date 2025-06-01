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

      const result = await this.signupUseCase.execute(userData);

      res.status(200).json({
          success: true,
          message: "OTP sent to your email",
          token: result
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}