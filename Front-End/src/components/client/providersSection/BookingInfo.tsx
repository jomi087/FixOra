import { useEffect } from "react"

import BookingDatesInfo from "@/components/common/BookingDatesInfo"
import TimeSlotSelector from "@/components/common/TimeSlotSelector"
import BookingDialog from "./BookingDialog"

import { BookingStatus } from "@/shared/enums/BookingStatus"
import socket from "@/services/soket"
import type { BookingResponsePayload } from "@/shared/Types/booking"

import Lottie from 'lottie-react'
import LodingAnimation from '@/assets/animations/BoxyLoading.json'
import { toast } from "react-toastify"
import { useBookingRequest } from "@/hooks/useBookingRequest"

const BookingInfo:React.FC = () => {
       
    const {
        isWaiting, setIsWaiting,
        data,
        dates,selectedDate, handleDateChange,
        timeSlots, selectedTime, handleTimeChange,
        isDialogOpen, setIsDialogOpen,
        selectedServiceId, setSelectedServiceId,
        description, setDescription,
        submitBooking
    } = useBookingRequest()
    
    
    useEffect(() => {
        const handleBookingResponse = (payload: BookingResponsePayload) => {
            setIsWaiting(false);
            
            if (payload.status === BookingStatus.ACCEPTED) {
                toast.success(`Booking on ${payload.fullDate} at ${payload.time} is Scheduled successfully`, {
                    autoClose:10000
                })
            } else if (payload.status === BookingStatus.REJECTED) {
                toast.warn(`Your Booking was Rejected`)
                toast.info(`Reason: ${payload.reason}`)
            }
        }
        socket.on('booking:response', handleBookingResponse)

        return () => {
            socket.off("booking:response", handleBookingResponse);
        };

    }, []); 

    return (
        <>
            { isWaiting &&
                <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
                    <Lottie animationData={LodingAnimation} loop={true} className="w-40 h-40" />
                    <p className="m-4 text-primary text-lg font-mono">Waiting for provider response...</p>
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

          