import { UploadedFile } from "../../../shared/types/common";

export interface IFileValidationService {
  validate(file: UploadedFile): void;
}
