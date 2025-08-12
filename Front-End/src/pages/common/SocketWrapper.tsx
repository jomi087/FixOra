import socket from '@/services/soket';
import type { BookingRequestPayload } from '@/shared/Types/booking';
import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useRef, useState } from 'react';
import BookingApplicationDialouge from '../../components/provider/BookingApplicationDialouge';
import { toast } from 'react-toastify';

const SocketWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAppSelector((state) => state.auth);
    const [bookingDialog, setBookingDialog] = useState<BookingRequestPayload | null>(null);
    const isConnected = useRef(false);

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
            console.log('New booking request', payload);
            setBookingDialog(payload);
        };

        const handleConnectError = (err: any) => {
            console.error('Socket connect error:', err.message, err);
            toast.error(err.message);
        };

        socket.on('connect', handleConnect);
        socket.on('booking:requested', handleBookingRequested);
        socket.on('connect_error', handleConnectError);

        return () => {
            socket.off('connect', handleConnect); 
            socket.off('booking:requested', handleBookingRequested);
            socket.off('connect_error', handleConnectError);
        };
    }, [user]);

    return (
        <>
            { children }
            { bookingDialog && (
                <BookingApplicationDialouge
                    data={bookingDialog}
                    onClose={() => setBookingDialog(null)}
                />
            )}
        </>
    );
};

export default SocketWrapper;
