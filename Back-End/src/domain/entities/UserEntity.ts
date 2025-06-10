/*  You can see another version Using class  */

import { RoleEnum } from "../constant/Roles.js";

export interface User {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  mobileNo: string;
  password: string; // hashed
  role: RoleEnum; // 
  refreshToken?: string;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}




