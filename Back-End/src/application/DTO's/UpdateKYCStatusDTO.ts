import { KYCStatus } from "../../shared/Enums/KYCstatus.js";

export interface UpdateKYCStatusInputDTO {
  id: string;
  action: KYCStatus;
  reason?: string;
  adminId: string;
}

export interface UpdateKYCStatusOutputDTO {
  id: string,
  message: string;
  
}
