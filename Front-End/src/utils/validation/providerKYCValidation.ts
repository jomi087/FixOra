import { z } from "zod";
import { KYCImageSize, Messages } from "../constant";
import { imageValidatorField } from "./imageValidation";


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

  profileImage: imageValidatorField(KYCImageSize,"Profile image"),           
    
  idCard: imageValidatorField(KYCImageSize,"ID card"),                 
    
  educationCertificate: imageValidatorField(KYCImageSize, "Education certificate"),   

  experienceCertificate: imageValidatorField(KYCImageSize, "Experience certificate"),   
});

export type ProviderKYCType = z.infer<typeof providerKYCSchema>; // zod its self create  