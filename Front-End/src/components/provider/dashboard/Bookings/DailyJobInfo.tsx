import Calendar from "./Calendar";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { addConfirmedBooking, fetchProviderBookingsInfo, removeBooking } from "@/store/provider/bookingSlice";
import { NotificationType } from "@/shared/enums/NotificationType";
import { toast } from "react-toastify";
import type { ConfirmJobBookings } from "@/shared/Types/booking";
import { useNavigate } from "react-router-dom";
import AllSlots from "./AllSlots";
import ConfirmedSlots from "./ConfirmedSlots";

const DailyJobInfo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slot, setSlot] = useState(true);
  const { data } = useAppSelector((state) => state.providerBookingInfo);
  const { items } = useAppSelector(state => state.notification);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProviderBookingsInfo());
  }, [dispatch]);

  //notificaition
  useEffect(() => {
    const latest = items[0];
    if (latest?.type === NotificationType.BOOKING_CONFIRMED) {
      dispatch(addConfirmedBooking(latest.metadata));
    } else if (latest?.type === NotificationType.BOOKING_CANCELLED) {
      dispatch(removeBooking(latest.metadata.bookingId));
    }
  }, [items]);

  //booking Details
  const handleBookingDetails = (booking: ConfirmJobBookings) => {
    if (booking.status == BookingStatus.PENDING) {
      toast.error("Opps Wrong-Booking entry");
      return;
    }

    navigate(`/provider/booking-details/${booking.bookingId}`, {
      state: { from: "dashboard" },
    });
  };

  return (
    <div className="flex flex-col md:flex-row  mt-5 mx-2 gap-2">
      {/* Left calendar */}
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        slot={slot}
        setSlot={setSlot}
      />

      {/* Right side timeslots should take full remaining space */}
      {slot ? (
        <AllSlots
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          data={data}
          handleBookingDetails={handleBookingDetails}
        />
      ) : (
        <ConfirmedSlots
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          data={data}
          handleBookingDetails={handleBookingDetails}
        />
      )}
    </div>
  );

};


export default DailyJobInfo;
