import { UploadedFile } from "../../../shared/types/common";

export interface IFileValidator {
  validate(file: UploadedFile): void;
}
