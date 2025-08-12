import { useState } from "react"

import BookingDatesInfo from "@/components/common/BookingDatesInfo"
import TimeSlotSelector from "@/components/common/TimeSlotSelector"
import BookingDialog from "./BookingDialog"

import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from "@/utils/constant"
import { generateDateList, generateTimeSlots } from "@/utils/helper/Date&Time"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toast } from "react-toastify"
import AuthService from "@/services/AuthService"
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode"
import { addBooking } from "@/store/user/providerBookingSlice"
import { BookingStatus } from "@/shared/enums/BookingStatus"

const BookingInfo:React.FC = () => {
       
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

    const { data } = useAppSelector((state) => state.providerBooking)
    const dispatch = useAppDispatch();
        
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(""); 
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        setIsDialogOpen(true)
    }

    const submitBooking = async() => {        
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
            issue : description 
        }
        
        try {
            const res = await AuthService.BookingApplicationApi(payload)
            if (res.status === HttpStatusCode.OK) {
                //laoding time
                //payment logic
                if (res.data.booking.bookings.status !== BookingStatus.REJECTED) {
                    dispatch(addBooking(res.data.booking.bookings))
                }
                toast.success(res.data.booking.bookings.status)
                setIsDialogOpen(false);
                setSelectedTime("");
                setSelectedServiceId("");
                setDescription("");
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
            toast.error(errorMsg);
        }
    }

    return (
        <>
            { data ? (
                <div className="shadow-lg shadow-ring border-2 mt-10 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                    <BookingDatesInfo
                        dates={dates}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                    />

                    <TimeSlotSelector
                        timeSlots={timeSlots}
                        selectedTime={selectedTime}
                        onTimeChange={handleTimeChange}
                        selectedDate={selectedDate}
                        bookedSlots={data.bookings}
                    />
                    
                    <BookingDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        selectedServiceId={selectedServiceId}
                        setSelectedServiceId={setSelectedServiceId}
                        description={description}
                        setDescription={setDescription}
                        submitBooking = {submitBooking}
                    />
                </div> 
            ):(
                <div className="flex justify-center h-[78vh] items-center text-sm text-muted-foreground ">
                    No Data found.
                </div>     
            )}
        </>
    )
}

export default BookingInfo


            {/* History  if need use it as another component*/}
            // <div className="shadow-lg shadow-ring border-2 mt-6 p-6 rounded-xl">
            //     <h3 className="text-lg font-semibold mb-4">Booking History</h3>
            //     <p className="text-sm text-gray-500">History section will be added here later.</p>
            // </div>

          