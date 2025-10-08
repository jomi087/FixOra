import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import {  EditProfileInputDTO, ProfileDTO, UpdatedProfileOutputDTO } from "../../DTO's/EditProfileDTO";
import { IUpdateProfileUseCase } from "../../Interface/useCases/Client/IUpdateProfileUseCase";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages;

export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        private readonly _userRepository : IUserRepository
        
    ) { }
    
    async execute(input: EditProfileInputDTO ):Promise<UpdatedProfileOutputDTO> {
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
                        ] as [number ,number]
                    }
                },
            };

            const updatedUser = await this._userRepository.updateProfie(userId, data);

            if (!updatedUser ) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }

            // const { geo, ...restLocation } = updatedUser.location!; eslint will show error cz of geo variable in not used resone i done like this was  i wanted to it destrcture from location
            //  so to avoid this  we can write like this 
            const { geo: _, ...restLocation } = updatedUser.location!;
            // cz in eslint rules we have mention that leading traling with "_" will be ignored

            const mappedData: ProfileDTO = {
                fname: updatedUser.fname,
                lname: updatedUser.lname!,
                mobileNo: updatedUser.mobileNo!,
                location: restLocation
            };

            return { data: mappedData };


        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR }; 
        }
    }
}