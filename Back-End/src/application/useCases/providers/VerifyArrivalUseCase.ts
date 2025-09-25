import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { IVerifyArrivalUseCase } from "../../Interface/useCases/Provider/IVerifyArrivalUseCase";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { BOOKING_ID_NOT_FOUND, USER_NOT_FOUND, INTERNAL_ERROR } = Messages;

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
            if (!bookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

            const userData = await this._userRepository.findByUserId(bookingData.userId);
            if (!userData || !userData.email) throw { status: NOT_FOUND, message: USER_NOT_FOUND };

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

            const html =
                `<h1>FixOra Arrival OTP</h1>
                <p>
                    Your service provider has indicated that they are at your location. 
                    Please provide the OTP below to the provider <strong>only after they have actually arrived</strong>. 
                    This OTP confirms their arrival and allows them to start the work.
                </p>
                <p><strong>Your OTP code is: ${otp}</strong></p>
                <p>For security, do not share this OTP with anyone else or before the provider reaches your home.</p>`;

            await this._emailService.sendEmail(userData.email, "FixOra OTP", html);

            return token;
            
        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}