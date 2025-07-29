import { Address } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import {  EditProfileInputDTO, ProfileDTO, UpdatedProfileOutputDTO } from "../../DTO's/EditProfileDTO.js";
import { IUpdateProfileUseCase } from "../../Interface/useCases/Client/IUpdateProfileUseCase.js";

const { NOT_FOUND, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        private readonly userRepository : IUserRepository
        
    ) { }
    
    async execute(input: EditProfileInputDTO ):Promise<UpdatedProfileOutputDTO> {
        try {

            const { userId, profileData } = input

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
            }

            const updatedUser = await this.userRepository.updateProfie(userId, data)

            if (!updatedUser) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }

            const { geo, ...restLocation } = updatedUser.location;

            const mappedData: ProfileDTO = {
                fname: updatedUser.fname,
                lname: updatedUser.lname,
                mobileNo: updatedUser.mobileNo,
                location: restLocation
            };

            return { data: mappedData };


        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR}; 
        }
    }
}