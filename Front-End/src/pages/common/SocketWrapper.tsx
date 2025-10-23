import socket from "@/services/soket";
import type { BookingAutoRejectPayload, BookingRequestPayload, Notification } from "@/shared/types/booking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useRef } from "react";
import BookingApplicationDialouge from "../../components/provider/BookingApplicationDialouge";
import { toast } from "react-toastify";
import notificationMp3 from "@/assets/bookingnotification.mp3";
import { addNotification } from "@/store/common/notificationSlice";
import { generateToken } from "@/services/pushNotificationConfig";
import AuthService from "@/services/AuthService";
import { shortBookingId } from "@/utils/helper/utils";
import { RoleEnum } from "@/shared/enums/roles";
import type { AxiosError } from "axios";
import { addBookingRequest, fetchPendingBookingRequests, removeBookingRequest } from "@/store/provider/bookingRequestSlice";

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { bookingDialog } = useAppSelector((state) => state.providerBookingRequest);
  const firstBooking = bookingDialog[0];

  const isConnected = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    const registerFcmToken = async () => {
      //Firebase Cloud Messaging Token
      const FcmToken = await generateToken();
      if (!FcmToken) return;

      const storedToken = localStorage.getItem("fcm_token");
      if (storedToken === FcmToken) return;

      try {
        await AuthService.registerToken(FcmToken, "web");
        localStorage.setItem("fcm_token", FcmToken);
        console.log("FCM Token registered successfully!");
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMsg = error?.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
      }
    };
    if (user && user.role === RoleEnum.PROVIDER) {
      dispatch(fetchPendingBookingRequests(user));
      registerFcmToken();
    }
  }, [user]);

  useEffect(() => {
    audioRef.current = new Audio(notificationMp3);
    audioRef.current.volume = 0.5;
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

    //notification
    const handleNotification = (payload: Notification) => {
      dispatch(addNotification(payload));
    };

    //pop up booking request
    const handleBookingRequested = (payload: BookingRequestPayload) => {
      dispatch(addBookingRequest(payload));
    };

    const handleBookingAutoReject = (payload: BookingAutoRejectPayload) => {
      dispatch(removeBookingRequest({ bookingId: payload.bookingId }));

      const toastMessage = (
        <div className="w-full">
          <p className="p-2 text-sm">{`Booking request of ${shortBookingId(payload.bookingId)} was a Auto Rejected`}</p>
          <p className="text-end text-[11px] ">{`[Reason: ${payload.reason}]`}</p>
        </div>
      );

      toast.success(toastMessage, {
        position: "top-center",
        autoClose: 2500,
        className: "custom-toast",
        closeOnClick: true,
        pauseOnHover: false,
      });
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
      audioRef.current.play().catch((e) => { console.log(e); });

    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset when no bookings
    }
  }, [bookingDialog]);

  return (
    <>
      {children}
      {firstBooking  && (
        <BookingApplicationDialouge
          key={firstBooking.bookingId}
          data={firstBooking}
          onClose={() => dispatch(removeBookingRequest({ bookingId: firstBooking.bookingId }))}
        />
      )}
    </>
  );
};

export default SocketWrapper;


