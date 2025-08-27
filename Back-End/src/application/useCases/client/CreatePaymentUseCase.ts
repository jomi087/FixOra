import { ICreatePaymentUseCase } from "../../Interface/useCases/Client/ICreatePaymentUseCase.js";
import { Messages } from "../../../shared/Messages.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService.js";


const { INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class CreatePaymentUseCase implements ICreatePaymentUseCase {
    constructor(
        private readonly _paymentService : IPaymentService
    ) {}
    
    async execute(bookingId: string): Promise<string> {
        try {
            return await this._paymentService.createPaymentIntent(bookingId)
        } catch (error:any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}