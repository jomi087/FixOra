import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from "@/utils/constant"
import { generateDateList, generateTimeSlots } from "@/utils/helper/Date&Time"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toast } from "react-toastify"
import AuthService from "@/services/AuthService"
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode"
import { addBooking } from "@/store/user/providerBookingSlice"
import { useState } from "react"
import { BookingStatus } from "@/shared/enums/BookingStatus"

export const useBookingRequest = () => {
    const dates = generateDateList(DATE_RANGE_DAYS)
    const timeSlots = generateTimeSlots(
        TIME_SLOTS.STARTHOURS,
        TIME_SLOTS.ENDHOURS,
        TIME_SLOTS.INTERVAL
    ); // Default: 9AM–6PM, every 30 min

    const FirstDate = dates[0]?.fullDate || ""

    const [selectedDate, setSelectedDate] = useState(FirstDate);
    const [selectedTime, setSelectedTime] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [description, setDescription] = useState("")

    const [isWaiting, setIsWaiting] = useState(false);

    const { data } = useAppSelector((state) => state.providerBooking)
    const dispatch = useAppDispatch();

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedTime("");
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        setIsDialogOpen(true);
    }

    const submitBooking = async () => {
        if (!data?.providerId) {
            toast.error("provider data missing")
            return
        }

        const payload = {
            providerId: data.providerId,
            providerUserId: data.user.userId,
            fullDate: selectedDate, //dd/mm/year
            time: selectedTime, //11:00
            issueTypeId: selectedServiceId,
            issue: description
        }

        setIsWaiting(true);

        try {
            const res = await AuthService.BookingApplicationApi(payload)
            if (res.status === HttpStatusCode.OK) {

                if (res.data.booking.bookings.status !== BookingStatus.REJECTED) {
                    dispatch(addBooking(res.data.booking.bookings))
                }
                setIsDialogOpen(false);
                setSelectedTime("");
                setSelectedServiceId("");
                setDescription("");
            }
        } catch (error: any) {
            setIsWaiting(false);
            const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
            toast.error(errorMsg);
        }
    }

    return {
        isWaiting, setIsWaiting,
        data,
        dates, selectedDate, handleDateChange,
        timeSlots, selectedTime, handleTimeChange,
        isDialogOpen, setIsDialogOpen,
        selectedServiceId, setSelectedServiceId,
        description, setDescription,
        submitBooking
    }
}

