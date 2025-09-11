
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ImageUploaderService implements IImageUploaderService {
    async uploadImage(buffer: Buffer, folder: string = "FixOra/All"): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },   // here we can add access_mode also (like access_mode : publie ) but defult is plubilc 
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url || "");
                }
            );

            const readable = new Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(stream);
        });
    }
    
    // 1. Upload image (private by default)
    async uploadImageId(buffer: Buffer, folder: string = "FixOra/All"): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder, access_mode: "authenticated" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.public_id || "");
                }
            );

            const readable = new Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(stream);
        });
    }

    // 2. Generate signed URL (with expiry)
    getSignedUrl(publicId: string, expiresInSeconds: number = 60): string {
        const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
        return cloudinary.url(publicId, {
            type: "authenticated",  // must match upload access_mode
            sign_url: true,         // generate signature
            secure: true,
            expires_at: expiry,      // URL expiry
        });
    }
}


/* uploads and genatare url (puplic url)
    async uploadImage(buffer: Buffer, folder : string = "FixOra/All"): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },   // here we can add access_mode also (like access_mode : publie ) but defult is plubilc 
                ( error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url || "");
                }
            );

            const readable = new Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(stream);
        });
    }
 */