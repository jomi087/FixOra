import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { SelectedLocationInputDTO } from "../../DTOs/EditProfileDTO";
import { IUpdateSelectedLocationUseCase } from "../../Interface/useCases/Client/IUpdateSelectedLocationUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const {  INTERNAL_ERROR } = Messages;


export class UpdateSelectedLocationUseCase implements IUpdateSelectedLocationUseCase {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(input: SelectedLocationInputDTO): Promise<void> {
        const { userId, location } = input;
        try {
            await this._userRepository.updateSelectedLocation(userId,location);
        } catch (err) {
            if (err.status && err.message) {
                throw err;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}