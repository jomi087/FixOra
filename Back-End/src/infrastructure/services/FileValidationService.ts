import { IFileValidationService } from "../../domain/interface/serviceInterfaceTempName/IFileValidationService";
import { Messages } from "../../shared/const/Messages";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { AppError } from "../../shared/errors/AppError";
import { UploadedFile } from "../../shared/types/common";


const { BAD_REQUEST } = HttpStatusCode;
const { INVALID_IMAGE_FORMAT, IMAGE_SIZE_EXCEEDED } = Messages;

export class FileValidationService  implements IFileValidationService  {
    constructor(
        private allowedTypes: string[],
        private maxSizeMB: number
    ) { }

    validate(file: UploadedFile): void {
        if (!this.allowedTypes.includes(file.mimeType)) {
            throw new AppError(BAD_REQUEST, INVALID_IMAGE_FORMAT);
        }

        if (file.size > this.maxSizeMB * 1024 * 1024) {
            throw new AppError(BAD_REQUEST, IMAGE_SIZE_EXCEEDED);
        }
    }
}