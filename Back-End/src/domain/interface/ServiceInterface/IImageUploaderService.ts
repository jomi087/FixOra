export interface IImageUploaderService {
  uploadImage(buffer: Buffer, folder? : string): Promise<string>;
}
