import { z } from "zod";
import { KYCImageSize, Messages } from "../constant";

export const imageValidator = (maxSizeInMB: number = 5 , msg : string) =>
  z
    .any()
    .refine((file) => file instanceof File, {
      message: `${ msg }is required `,
    })
    .refine((file: File) => {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      return validTypes.includes(file.type);
    }, { message: Messages.IMAGE_TYPE_INVALID })
    .refine((file: File) => {
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes;
    }, { message: `Image size should not exceed ${maxSizeInMB}MB.` });


export const providerKYCSchema = z.object({

  service: z.string().min(1, Messages.SERVICE_REQUIRED), //id
    
  specialization: z.array(z.string()).min(1, Messages.SELECT_SPECIALIZATION), //array of sub id

  serviceCharge: z.string()
    .min(1,Messages.SERVICE_CHARGE_REQUIRED,)
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 300 && num <= 500;
    }, {
      message: Messages.SERVICE_CHARGE_RANGE,
    }),

  dob: z.string().min(1, Messages.DOB_REQUIRED),

  gender: z.enum(["Male", "Female", "Other"], {
    message: Messages.GENDER_REQUIRED
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
      message: Messages.EXPERIENCE_CERT_INVALID,
    }
  ),
});

export type ProviderKYCType = z.infer<typeof providerKYCSchema>; // zod its self create  