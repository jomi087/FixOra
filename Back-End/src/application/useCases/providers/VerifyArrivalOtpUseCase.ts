import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifyArrivalOtpUseCase } from "../../Interface/useCases/Provider/IVerifyArrivalOtpUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { BAD_REQUEST } = HttpStatusCode;
const { INVALID_OTP, OTP_EXPIRED } = Messages;

export class VerifyArrivalOtpUseCase implements IVerifyArrivalOtpUseCase {

    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _tokenService: ITokenService,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(otp: string, token: string): Promise<void> {
        try {

            const secret = process.env.JWT_Arival_TOKEN!;
            const decodeUserData = this._tokenService.verifyToken(token, secret) as { bookingId: string, email: string };

            const storedOtp = await this._otpRepository.findOtpByEmail(decodeUserData.email);
            if (!storedOtp) {
                throw new AppError(BAD_REQUEST, OTP_EXPIRED);
            } else if (storedOtp.otp != otp) {
                throw new AppError(BAD_REQUEST, INVALID_OTP);
            }

            await this._bookingRepository.updateBookingStatus(decodeUserData.bookingId, BookingStatus.INITIATED);

        } catch (error: unknown) {
            throw error;
        }
    }
}