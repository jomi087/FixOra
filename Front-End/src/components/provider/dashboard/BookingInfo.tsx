import AuthService from '@/services/AuthService';
import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from '@/utils/constant';
import { generateDateList, generateTimeSlots } from '@/utils/helper/Date&Time';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';


const dates = generateDateList(DATE_RANGE_DAYS)
const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL); // Default: 9AM–6PM, every 30 min

const BookingInfo: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AuthService.BookingInfoApi()
      } catch (error:any) {
        const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg); 
      }
    }
    fetchData()
  })
  return (
    <div className=" border-1 border-primary/50 text-body-text overflow-x-auto w-screen mx-2 my-5 rounded-md shadow-2xl ">
      <div className="text-center py-4 bg-gradient-background   ">
        <span className="mx-4 font-bold">{dates[0]?.fullDate}</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-[minmax(60px,_auto)_repeat(7,1fr)] border-t">
        <div className="border-b border-r p-1 text-center font-serif ">D&T</div>
        {dates.map((date) => (
          <React.Fragment key={date.fullDate} >
            {/* Desktop */}
            <div className="hidden lg:block border-b border-r p-1 text-center font-semibold">
              { date.day }
            </div>
            {/* Mobile */}
            <div className="block lg:hidden border-b border-r p-1 text-center font-semibold">
              { date.dayShortName }
            </div>
          </React.Fragment>
        ))}
        { timeSlots.map((time) => (
          <React.Fragment key={time.value} >
            {/* Desktop */}
            <div className="hidden lg:block border rounded-md p-2 font-medium text-center pr-4 ">
              {time.time}
            </div>
              {/* Mobile */}
            <div className="block lg:hidden border rounded-md p-2 font-medium text-center pr-4 ">
              {time.timeShort}
            </div>

            {dates.map((_, i) => (
              <div
                key={i}
                className="h-10 border-1 rounded-md  hover:border-2 hover:border-primary/50 cursor-pointer "
              >
              </div>
            ))}
          
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingInfo;
