import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


export class ImageUploaderService implements IImageUploaderService {
    
    async uploadImage(buffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "FixOra/Services" },
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
}
