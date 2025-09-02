import socket from "@/services/soket";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { BookingInfo } from "@/shared/Types/booking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addConfirmedBooking, fetchProviderBookingsInfo } from "@/store/provider/bookingSlice";
import { DATE_RANGE_DAYS, TIME_SLOTS } from "@/utils/constant";
import { dateTime, generateDateList, generateTimeSlots, splitDateTime } from "@/utils/helper/date&Time";
import React, { useEffect, useState } from "react";

const dates = generateDateList(DATE_RANGE_DAYS);
const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL);

const BookingInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.providerBookingInfo);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProviderBookingsInfo());
  }, [dispatch]);

  useEffect(() => {
    const handleConfirmedBooking = (payload : BookingInfo) => {
      dispatch(addConfirmedBooking(payload));
    };

    socket.on("booking:confirmed", handleConfirmedBooking);

    return () => {
      socket.off("booking:confirmed", handleConfirmedBooking);

    };
  }, [dispatch]);

  return (
    <div className=" border-1 border-primary/50 text-body-text overflow-x-auto w-screen mx-2 my-5 rounded-md shadow-2xl ">
      <div className="text-center py-4 bg-gradient-background   ">
        <span className="mx-4 font-bold">{dates[0]?.fullDate}</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-[minmax(60px,_auto)_repeat(7,1fr)] border-t">
        <div className="border-b border-r p-1 text-center font-serif ">D&T</div>

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
                  b.status === BookingStatus.CONFIRMED
                );
              });

              const bookingDateTime = dateTime(dateObj.fullDate, slot.value);
              const isTimePassed = bookingDateTime.getTime() <= Date.now();

              let slotClass = "h-10 border-1 rounded-md rounded-md border  hover:border-primary transition ";

              if (booking?.acknowledgment.isWorkCompletedByProvider && booking?.acknowledgment.isWorkConfirmedByUser) {
                slotClass += " text-green-500  text-center cursor-pointer text-base font-serif";
              } else if (booking?.status === BookingStatus.CONFIRMED) {
                slotClass += "text-cyan-500 cursor-pointer text-center text-base font-mono";
              } else if (isTimePassed) {
                slotClass += "opacity-50 cursor-not-allowed text-sm";
              } else {
                slotClass += "text-primary  cursor-not-allowed text-sm";
              }

              return (
                <button
                  key={i}
                  disabled={ !booking}
                  onClick={() => {
                    setSelectedSlot(`${dateObj.fullDate}_${slot.value}`);
                  }}
                  title = {
                    booking
                      ? booking.status === BookingStatus.CONFIRMED
                        ? "booked"
                        : ""
                      : isTimePassed
                        ? "Un-Available"
                        : "Slot Empty"
                  }
                  className={`${slotClass} ${selectedSlot === `${dateObj.fullDate}_${slot.value }` ? " !text-base shadow-md shadow-ring border-primary " : ""} `}
                >
                  { booking?.acknowledgment.isWorkCompletedByProvider && booking?.acknowledgment.isWorkConfirmedByUser
                    ? "finished✔️"
                    : booking?.status === BookingStatus.CONFIRMED
                      ? "Booked🔖"
                      : isTimePassed
                        ? slot.timeShort
                        : "Empty"
                  }
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingInfo;
