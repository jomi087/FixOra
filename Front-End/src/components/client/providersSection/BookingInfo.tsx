import BookingDatesInfo from "@/components/common/BookingDatesInfo"
import TimeSlotSelector from "@/components/common/TimeSlotSelector"
import BookingDialog from "./BookingDialog"

import Lottie from 'lottie-react'
import LodingAnimation from '@/assets/animations/BoxyLoading.json'
import { useBookingRequest } from "@/hooks/useBookingRequest"
import { ModeOfPayment } from "@/components/common/Others/ModeOfPayment"




const BookingInfo: React.FC = () => {

    const {
        isWaiting,showModePayment,
        data,
        dates, selectedDate, handleDateChange,
        timeSlots, selectedTime, handleTimeChange,
        isDialogOpen, setIsDialogOpen,
        selectedServiceId, setSelectedServiceId,
        description, setDescription,
        submitBooking,
        handlePayment
    } = useBookingRequest()

    return (
        <>
            { isWaiting &&
                <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
                    { showModePayment ? (
                        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-xl overflow-auto shadow-black shadow-2xl bg-background ">
                            < ModeOfPayment handlePayment={handlePayment} />
                        </div>
                    ) : (
                        <>
                            <Lottie animationData={LodingAnimation} loop={true} className="w-40 h-40" />
                            <p className="m-4 text-primary text-lg font-mono">Waiting for provider response...</p>
                        </>       
                    )}
                </div>
            }
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

          