import socket from "@/services/soket";
import type { BookingAutoRejectPayload, BookingRequestPayload, Notification } from "@/shared/types/booking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useRef, useState } from "react";
import BookingApplicationDialouge from "../../components/provider/BookingApplicationDialouge";
import { toast } from "react-toastify";
import notificationMp3 from "@/assets/bookingnotification.mp3";
import { addNotification } from "@/store/common/notificationSlice";

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [bookingDialog, setBookingDialog] = useState<BookingRequestPayload[]>([]); //why arrey is because  to story multer booking request or else it will overide the privous request
  const firstBooking = bookingDialog[0];

  const isConnected = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(notificationMp3);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (isConnected.current) {
        socket.disconnect();
        isConnected.current = false;
      }
      return;
    }
    // if (!user) return;

    if (!isConnected.current) { //We don't accidentally call socket.connect() again on every render useRef will not re-render
      socket.connect();
      isConnected.current = true;
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleNotification = (payload: Notification) => {
      dispatch(addNotification(payload));
    };

    const handleBookingRequested = (payload: BookingRequestPayload) => {
      setBookingDialog((prev) => [...prev, payload]);
    };

    const handleBookingAutoReject = (payload: BookingAutoRejectPayload) => {
      setBookingDialog((prev) => prev.filter((b) => b.bookingId !== payload.bookingId));
      toast.warn(`Booking request of ${payload.bookingId} was a auto Rejected`);
      toast.info(`Reason: ${payload.reason}`);
    };

    const handleConnectError = (err: any) => {
      toast.error(err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("notification", handleNotification);
    socket.on("booking:requested", handleBookingRequested);
    socket.on("booking:autoReject", handleBookingAutoReject);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
      socket.off("booking:requested", handleBookingRequested);
      socket.off("booking:autoReject", handleBookingAutoReject);
      socket.off("connect_error", handleConnectError);
    };
  }, [user]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (bookingDialog.length > 0) {
      audioRef.current.play().catch(() => { }); // play when we have bookings
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset when no bookings
    }
  }, [bookingDialog]);
  //const firstBooking = requests[0];

  return (
    <>
      {children}
      {firstBooking && (
        <BookingApplicationDialouge
          key={firstBooking.bookingId}
          data={firstBooking}
          onClose={() =>
            setBookingDialog((prev) =>
              prev.filter((_, i) => i !== 0)
            )
          }
        />
      )}
    </>
  );
};

export default SocketWrapper;


{/* { bookingDialog.map((booking) => (
  <BookingApplicationDialouge
    key={booking.bookingId}
    data={booking}
    onClose={() =>
      setBookingDialog((prev) =>
        prev.filter((b) => b.bookingId !== booking.bookingId)
      )
    }
  />
))} */}