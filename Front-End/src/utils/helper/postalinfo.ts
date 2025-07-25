import axios from "axios"
import { toast } from "react-toastify";
import { Messages } from "../constant";

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
            const apiMessage = data?.Message || Messages.INVALID_OR_UNAVAILABLE_PINCODE;
            throw new Error(apiMessage);
        }
    } catch (error: any) {
        // If it's an axios error, return a more meaningful message
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || Messages.NETWORK_ERROR_FETCHING_POSTAL_INFO);
        }
        throw error;
    }
}