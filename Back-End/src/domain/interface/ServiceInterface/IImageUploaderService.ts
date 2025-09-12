export interface IImageUploaderService {
  uploadImage(buffer: Buffer, folder?: string): Promise<string>;
  // uploadImageId(buffer: Buffer, folder?: string): Promise<string>;
  // getSignedUrl(publicId: string, expiresInSeconds: number ): string;
}
