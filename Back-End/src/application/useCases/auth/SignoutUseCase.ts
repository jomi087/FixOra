import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { ISignoutUseCase } from "../../Interface/useCases/Auth/ISignoutUseCase.js";

const { BAD_REQUEST,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class SignoutUseCase implements ISignoutUseCase {
    constructor(
        private readonly _userRepository : IUserRepository,
    ) { }

    async execute( userId : string ):Promise<void> {
        try {
            if ( !(await this._userRepository.resetRefreshTokenById( userId ))) {
                throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            }
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}