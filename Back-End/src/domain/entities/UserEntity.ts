/*  You can see another version Using class  */

export interface User {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  mobileNo: string;
  password: string; // hashed
  isBlocked?: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}






