import { z } from "zod";

export const signupSchema = z.object({

    fname: z.string().trim().min(4, "First name is required, minimum 4 Characters"),
    lname: z.string().trim().min(2, "Last name is required, minimum 2 Characters"),
    email: z.string().trim().email("Invalid email format"),
    mobileNo : z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
    password: z.string().trim().min(10, "Password must be at least 10 characters"),
  
});

