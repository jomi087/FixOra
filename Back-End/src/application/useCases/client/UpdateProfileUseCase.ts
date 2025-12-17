import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../dtos/EditProfileDTO";
import { IUpdateProfileUseCase } from "../../Interface/useCases/Client/IUpdateProfileUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(
        private readonly _userRepository: IUserRepository

    ) { }

    async execute(input: EditProfileInputDTO): Promise<UpdatedProfileOutputDTO> {
        try {

            const { userId, profileData } = input;

            let data = {

                fname: profileData.fname,
                lname: profileData.lname,
                mobileNo: profileData.mobile,
                location: {
                    ...profileData.location,
                    geo: {
                        type: "Point" as const,
                        coordinates: [
                            profileData.location.coordinates.longitude,
                            profileData.location.coordinates.latitude
                        ] as [number, number]
                    }
                },
            };

            const updatedUser = await this._userRepository.updateProfie(userId, data);

            if (!updatedUser) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

            // const { geo, ...restLocation } = updatedUser.location!; eslint will show error cz of geo variable in not used resone i done like this was  i wanted to it destrcture from location
            //  so to avoid this  we can write like this 
            const { geo: _, ...restLocation } = updatedUser.location!;
            // cz in eslint rules we have mention that leading traling with "_" will be ignored

            const mappedData: UpdatedProfileOutputDTO = {
                fname: updatedUser.fname,
                lname: updatedUser.lname || "N/A",
                mobileNo: updatedUser.mobileNo || "N/A",
                location: restLocation
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}