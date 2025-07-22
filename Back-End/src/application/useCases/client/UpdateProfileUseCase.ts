import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { EditProfileDTO } from "../../DTO's/EditProfileDTO.js";

const { NOT_FOUND, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class UpdateProfileUseCase {
    constructor(
        private readonly userRepository : IUserRepository
        
    ) { }
    
    async execute(profileData: EditProfileDTO, userId : string) {
        try {
            const updatedUser  = await this.userRepository.update({ userId: userId }, {
                fname: profileData.fname,
                lname: profileData.lname,
                mobileNo: profileData.mobile,
                location: profileData.location,
            }, ["password", "refreshToken"])

            if (!updatedUser) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }
            return {
                user: {
                    fname: updatedUser.fname,
                    lname: updatedUser.lname,
                    mobileNo: updatedUser.mobileNo,
                    location :updatedUser?.location,
                } 
            };

        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR}; 
        }
    }
}