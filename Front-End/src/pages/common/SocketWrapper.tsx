import socket from '@/services/soket';
import type { BookingRequestPayload } from '@/shared/Types/booking';
import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useState } from 'react'
import BookingApplicationDialouge from '../../components/provider/BookingApplicationDialouge';


const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAppSelector((state) => state.auth);
    const [bookingDialog, setBookingDialog] = useState< BookingRequestPayload | null >(null)


    useEffect(() => {
        if (!user) return
        socket.connect();

        socket.on("connect", () => console.log("Socket connected:", socket.id));

        socket.on("booking:requested", (payload:BookingRequestPayload) => {
            console.log("New booking request", payload);
            setBookingDialog(payload)
        });

        return () => {
            socket.off("booking:requested");
             socket.disconnect()
        }
    },[user])

    return (
        <>
            {children}
            { bookingDialog && (
                <BookingApplicationDialouge  data={bookingDialog} onClose={()=>setBookingDialog(null) }
                />
            )}
        </>
    )
}

export default SocketWrapper


        // if (user.role === RoleEnum.CUSTOMER) {
        //     socket.on("booking:responded", (payload: BookingResponsePayload) => {
        //         console.log("Provider responded →", payload);
        //         if (payload.status === "ACCEPTED") {
        //             toast.success("Your booking was accepted!");
        //         } else {
        //             toast.error(" Your booking was rejected.");
        //         }
        //     });
        // }