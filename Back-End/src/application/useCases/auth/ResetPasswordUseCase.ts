import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IHashService } from "../../../domain/interface/serviceInterface/IHashService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IResetPasswordUseCase } from "../../Interface/useCases/auth/IResetPasswordUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        private readonly _hashService: IHashService,
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(token: string, password: string): Promise<void> {
        try {
            const hashedPassword = await this._hashService.hash(password);

            const decodeEmail = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET as string) as { email: string };

            if (!await this._userRepository.resetPasswordByEmail(decodeEmail.email, hashedPassword)) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

        } catch (error: unknown) {
            throw error;
        }
    }
}