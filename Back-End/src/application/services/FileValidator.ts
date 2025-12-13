import { IFileValidator } from "../../domain/interface/ServiceInterface/IFileValidator";
import { UploadedFile } from "../../shared/types/common";

export class FileValidator implements IFileValidator {
    constructor(
        private allowedTypes: string[],
        private maxSizeMB: number
    ) { }

    validate(file: UploadedFile): void {
        if (!this.allowedTypes.includes(file.mimeType)) {
            throw { status: 400, message: "Invalid image type" };
        }

        if (file.size > this.maxSizeMB * 1024 * 1024) {
            throw { status: 400, message: "Image too large" };
        }
    }
}