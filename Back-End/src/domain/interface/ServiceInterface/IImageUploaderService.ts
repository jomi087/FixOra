export interface IImageUploaderService {
  uploadImage(buffer: Buffer): Promise<string>;
}
