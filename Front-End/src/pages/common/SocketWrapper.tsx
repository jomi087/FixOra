import socket from '@/services/soket';
import type { BookingAutoRejectPayload, BookingRequestPayload } from '@/shared/Types/booking';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useEffect, useRef } from 'react';
import BookingApplicationDialouge from '../../components/provider/BookingApplicationDialouge';
import { toast } from 'react-toastify';
import notificationMp3 from '@/assets/bookingnotification.mp3'
import { addBookingRequest, autoRejectBooking, removeBookingRequest } from '@/store/provider/bookingSlice';

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();

  // const [bookingDialog, setBookingDialog] = useState<BookingRequestPayload[]>([]); //why arrey is because  to story multer booking request or else it will overide the privous request
  // const firstBooking = bookingDialog[0];

  const isConnected = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio(notificationMp3);
    audioRef.current.loop = true
    return () => {
        audioRef.current?.pause();
        audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    if (!isConnected.current) { //We don't accidentally call socket.connect() again on every render useRef will not re-render
      socket.connect();
      isConnected.current = true;
    }

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };

    const handleBookingRequested = (payload: BookingRequestPayload) => {
      //setBookingDialog((prev) => [...prev, payload]);
      dispatch(addBookingRequest(payload));

    };

    const handleBookingAutoReject = (payload: BookingAutoRejectPayload) => {
      //setBookingDialog((prev) => prev.filter((b)=> b.bookingId !== payload.bookingId ) ); 
      dispatch(autoRejectBooking(payload));
      toast.warn(`Booking request of ${payload.bookingId} was a auto Rejected`)
      toast.info(`Reason: ${payload.reason}`)
    }

    const handleConnectError = (err: any) => {
      toast.error(err.message);
    };

    socket.on('connect', handleConnect);
    socket.on('booking:requested', handleBookingRequested );
    socket.on('booking:autoReject', handleBookingAutoReject );
    socket.on('connect_error', handleConnectError );

    return () => {
      socket.off('connect', handleConnect);
      socket.off('booking:requested', handleBookingRequested);
      socket.off('booking:autoReject', handleBookingAutoReject);
      socket.off('connect_error', handleConnectError);
    };
  }, [user,dispatch]);


  useEffect(() => {
    if (!audioRef.current) return;
    if (requests.length > 0) {
      audioRef.current.play().catch(() => {}); // play when we have bookings
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset when no bookings
    }
  }, [requests]);

  const firstBooking = requests[0];

  return (
    <>
      {children}
      {firstBooking && (
        <BookingApplicationDialouge  
          key={firstBooking.bookingId}
          data={firstBooking}
          onClose={() => dispatch(removeBookingRequest(firstBooking.bookingId))}
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