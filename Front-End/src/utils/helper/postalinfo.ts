import axios from "axios"
import { toast } from "react-toastify";

// work for indian postal
export const getPostalInfo = async (pincode: string) => {
    try {
        
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        console.log(res)

        const data = res.data?.[0]
        console.log("data", data)
        
        if (data?.Status === "Success" && data.PostOffice?.length > 0) {
            return data.PostOffice[0]
        } else {
            throw new Error("Invalid Pincode");
        }
    } catch (error: any) {
        console.log("getPostalInfo error",error)
        toast.error("Something went wrong")
    }
}