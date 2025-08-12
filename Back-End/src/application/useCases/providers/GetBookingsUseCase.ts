import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { IGetBookingsUseCase } from "../../Interface/useCases/Provider/IGetBookingsUseCase.js";


const { INTERNAL_SERVER_ERROR,} = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class GetBookingsUseCase implements IGetBookingsUseCase {
    constructor(

    ){}
    
    async execute(): Promise<any>{
        try {
            // const bookingData = await this.booking
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}