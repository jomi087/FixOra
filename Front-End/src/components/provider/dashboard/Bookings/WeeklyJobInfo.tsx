// import socket from "@/services/soket";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { ConfirmJobBookings } from "@/shared/types/booking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addConfirmedBooking, fetchProviderBookingsInfo, removeBooking } from "@/store/provider/bookingSlice";
import { ONE_WEEK, TIME_SLOTS } from "@/utils/constant";
import { dateTime, generateDateList, generateTimeSlots, splitDateTime } from "@/utils/helper/date&Time";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BookingInfoShimmer from "./shimmer ui/BookingInfoShimmer";
import { NotificationType } from "@/shared/enums/NotificationType";

const dates = generateDateList(ONE_WEEK);
const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL);

const WeeklyJobInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error } = useAppSelector((state) => state.providerBookingInfo);
  // console.log("data", data);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  //bookinginfo
  useEffect(() => {
    dispatch(fetchProviderBookingsInfo());
  }, [dispatch]);

  const { items } = useAppSelector(state => state.notification);

  //triggering ui with the help of notification
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

  if (isLoading) {
    return <BookingInfoShimmer />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="text-body-text  ">
      <div className="border-1 border-primary/50 mx-2 rounded-md shadow-2xl">
        <div className="text-center py-4 bg-gradient-background rounded-t-md">
          <span className="mx-4 font-bold">{dates[0]?.fullDate}</span>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-[minmax(60px,_auto)_repeat(7,1fr)] border-t">
          <div className="border-b border-r p-1 text-center font-serif">D&T</div>
          {/* Date */}
          {dates.map((date) => (
            <React.Fragment key={date.fullDate}>
              {/* Desktop */}
              <div className="hidden lg:block border-b border-r p-1 text-center font-semibold">
                {date.day}
              </div>
              {/* Mobile */}
              <div className="block lg:hidden border-b border-r p-1 text-center font-semibold">
                {date.dayShortName}
              </div>
            </React.Fragment>
          ))}

          {/* Time */}
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.value}>
              {/* Desktop */}
              <div className=" hidden lg:block border rounded-md p-2 font-medium text-center pr-4 ">
                {slot.time}
              </div>
              {/* Mobile */}
              <div className="block lg:hidden border rounded-md p-2 font-medium text-center pr-4 ">
                {slot.timeShort}
              </div>

              {dates.map((dateObj, i) => {
                const booking = data.find((b) => {
                  const { date, time } = splitDateTime(b.scheduledAt);
                  return (
                    date === dateObj.fullDate &&
                    time === slot.value &&
                    (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED)
                  );
                });

                const bookingDateTime = dateTime(dateObj.fullDate, slot.value);
                const isTimePassed = bookingDateTime.getTime() <= Date.now();

                let slotClass = "h-10 border-1 rounded-md rounded-md border  hover:border-primary transition ";

                if (booking?.status === BookingStatus.COMPLETED) {
                  slotClass += " text-green-500  text-center cursor-pointer text-base font-serif";
                } else if (booking?.status === BookingStatus.CONFIRMED) {
                  slotClass += "text-cyan-500 cursor-pointer text-center text-base font-mono";
                } else if (isTimePassed) {
                  slotClass += "opacity-50 cursor-not-allowed text-sm";
                } else {
                  slotClass += "text-primary cursor-not-allowed text-sm";
                }

                //console.log("hi",booking?.status);

                return (
                  <button
                    key={i}
                    disabled={!booking}
                    onClick={() => {
                      setSelectedSlot(`${dateObj.fullDate}_${slot.value}`);
                      if (booking) { handleBookingDetails(booking); }
                    }}
                    title={
                      booking
                        ? booking.status === BookingStatus.CONFIRMED
                          ? "booked"
                          : ""
                        : isTimePassed
                          ? "Un-Available"
                          : "Slot Empty"
                    }
                    className={`${slotClass} ${selectedSlot === `${dateObj.fullDate}_${slot.value}` ? " !text-base shadow-md shadow-ring border-primary " : ""} `}
                  >
                    {booking?.status === BookingStatus.COMPLETED
                      ? "Finished✔️"
                      : booking?.status === BookingStatus.CONFIRMED
                        ? "Booked🔖"
                        : isTimePassed
                          ? slot.timeShort
                          : slot.timeShort
                    }
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyJobInfo;
