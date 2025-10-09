import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifyArrivalOtpUseCase } from "../../Interface/useCases/Provider/IVerifyArrivalOtpUseCase";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INVALID_OTP, OTP_EXPIRED, INTERNAL_ERROR } = Messages;

export class VerifyArrivalOtpUseCase implements IVerifyArrivalOtpUseCase {

    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _tokenService: ITokenService,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(otp: string, token: string): Promise<void> {
        try {

            const secret = process.env.JWT_Arival_TOKEN!;
            const decodeUserData = this._tokenService.verifyToken(token, secret) as  {bookingId :string ,email: string};

            const storedOtp = await this._otpRepository.findOtpByEmail(decodeUserData.email);
            if (!storedOtp) {
                throw { status: BAD_REQUEST, message: OTP_EXPIRED };
            } else if (storedOtp.otp != otp) {
                throw { status: BAD_REQUEST, message: INVALID_OTP };
            }

            await this._bookingRepository.updateBookingStatus(decodeUserData.bookingId, BookingStatus.INITIATED);

        } catch (error) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}