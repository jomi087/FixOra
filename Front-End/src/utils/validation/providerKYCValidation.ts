import { z } from "zod";
import { KYCImageSize } from "../constant";

export const imageValidator = (maxSizeInMB: number = 5 , msg : string) =>
  z
    .any()
    .refine((file) => file instanceof File, {
      message: `${ msg }is required `,
    })
    .refine((file: File) => {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      return validTypes.includes(file.type);
    }, { message: "Only JPEG, PNG, or JPG images are allowed." })
    .refine((file: File) => {
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes;
    }, { message: `Image size should not exceed ${maxSizeInMB}MB.` });


export const providerKYCSchema = z.object({

    service: z.string().min(1, "Please select a service"), //id
    
    specialization: z.array(z.string()).min(1, "Select at least one specialization"), //array of sub id

    serviceCharge: z.string()
        .min(1,"Service charge is required")
        .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 300 && num <= 500;
    }, {
        message: "Service charge must be a number between 300 - 500",
    }),

    dob: z.string().min(1, "Date of birth is required"),

    gender: z.enum(["Male", "Female", "Other"], {
        message: "Select a gender"
    }),

    profileImage: imageValidator(KYCImageSize,"Profile image"),           
    
    idCard: imageValidator(KYCImageSize,"ID card"),                 
    
    educationCertificate: imageValidator(KYCImageSize, "Education certificate"),   

    experienceCertificate: z.any().optional().refine(
      (file) => {
        if (!file) return true; // optional
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSizeInBytes = KYCImageSize * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSizeInBytes;
      },
      {
        message: "Experience certificate must be a valid JPG/PNG <= 5MB",
      }
    ),
});

export type ProviderKYCType = z.infer<typeof providerKYCSchema>; // zod its self create  