import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { SelectedLocationInputDTO } from "../../dtos/EditProfileDTO";
import { IUpdateSelectedLocationUseCase } from "../../Interface/useCases/Client/IUpdateSelectedLocationUseCase";




export class UpdateSelectedLocationUseCase implements IUpdateSelectedLocationUseCase {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(input: SelectedLocationInputDTO): Promise<void> {
        const { userId, location } = input;
        try {
            await this._userRepository.updateSelectedLocation(userId, location);
        } catch (error: unknown) {
            throw error;
        }
    }
}