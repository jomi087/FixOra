import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { IOtpRepository } from "../../../domain/interface/repositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/serviceInterface/IEmailService";
import { IOtpGenratorService } from "../../../domain/interface/serviceInterface/IOtpGeneratorService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifyArrivalUseCase } from "../../Interface/useCases/provider/IVerifyArrivalUseCase";
import { buildArrivalOtpEmail } from "../../services/emailTemplates/arrivalOtpTemplate";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class VerifyArrivalUseCase implements IVerifyArrivalUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _otpRepository: IOtpRepository,
        private readonly _emailService: IEmailService,
        private readonly _tokenService: ITokenService
    ) { }
    async execute(bookingId: string): Promise<string> {
        try {
            const bookingData = await this._bookingRepository.findByBookingId(bookingId);
            if (!bookingData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

            const userData = await this._userRepository.findByUserId(bookingData.userId);
            if (!userData || !userData.email) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));


            const payload = {
                bookingId,
                email: userData.email
            };

            const expiryTime = process.env.JWT_Arival_TOKEN_EXPIRY!;
            const secret = process.env.JWT_Arival_TOKEN!;

            const token = this._tokenService.generateToken(payload, secret, expiryTime);

            const otp = this._otpGenratorService.generateOtp();
            console.log("This is the verifiy arrival Otp", otp);

            await this._otpRepository.storeOtp({
                email: userData.email,
                otp,
                createdAt: new Date()
            });

            const html = buildArrivalOtpEmail({ otp });

            await this._emailService.sendEmail(userData.email, "FixOra OTP", html);

            return token;

        } catch (error: unknown) {
            throw error;
        }
    }
}