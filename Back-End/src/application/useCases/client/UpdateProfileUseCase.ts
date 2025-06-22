import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { EditProfileDTO } from "../../dtos/EditProfileDTO.js";

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
                throw { status: 404, message: "user Not Found" };
            }

            console.log(updatedUser)

            return {
                success: true,
                message: "Profile updated successfully",
            };

        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'Profile Updation failed ( something went wrong )'}; 
        }
    }
}