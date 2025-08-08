import {  useState } from "react"

import BookingDatesInfo from "@/components/common/BookingDatesInfo"
import TimeSlotSelector from "@/components/common/TimeSlotSelector"
import BookingDialog from "./BookingDialog"

import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from "@/utils/constant"
import { generateDateList, generateTimeSlots } from "@/utils/helper/Date&Time"
import { useAppSelector } from "@/store/hooks"
import { toast } from "react-toastify"
import AuthService from "@/services/AuthService"
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode"

const BookingInfo:React.FC = () => {
       
    const dates = generateDateList(DATE_RANGE_DAYS)
    const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL); // Default: 9AM–6PM, every 30 min

    const FirstDate = dates[0]?.fullDate || ""

    const [selectedDate, setSelectedDate] = useState(FirstDate);
    const [selectedTime, setSelectedTime] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [bookedSlots,_] =useState(["09:00", "11:00","04:00","05:00"]) // slot `value`s that are already booked
    
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [description, setDescription] = useState("")

    const { data } = useAppSelector((state)=>state.providerBooking)

    const handleDateChange = (date: string) => setSelectedDate(date);
    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        if (!bookedSlots.includes(time)) {
            setIsDialogOpen(true); 
        }
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
                toast.success("waiting waiting")
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
            toast.error(errorMsg);
        }
    }

    return (
        <>
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
                    bookedSlots={bookedSlots}
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
        </>
    )
}

export default BookingInfo


            {/* History  if need use it as another component*/}
            // <div className="shadow-lg shadow-ring border-2 mt-6 p-6 rounded-xl">
            //     <h3 className="text-lg font-semibold mb-4">Booking History</h3>
            //     <p className="text-sm text-gray-500">History section will be added here later.</p>
            // </div>

          