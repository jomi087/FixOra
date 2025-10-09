import type { Day } from "@/shared/types/availability";
import { format, setHours, setMinutes, addDays, addMinutes } from "date-fns";

//Date
export const generateDateList = (days: number = 7) => {
  const today = new Date();
  const dateList = [];

  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    dateList.push({
      day: format(date, "EEEE"), //EEEE = full name of the day (Monday)
      dayShortName: format(date, "EEE"), // EEE = hald name of the day(Mon)
      date: format(date, "dd"), //dd - 2 digit day of month(04) |->| d - 1 digit(4)
      month: format(date, "MMM"), //MMM  full month name (may) |->| MM -Month in number 2 dight (05)
      fullDate: format(date, "dd-MM-yyyy"),//yyyy full year (2025) |->| yy year with later 2 digt (25)
    });
  }

  return dateList;
};

//Time
export const generateTimeSlots = (startHour: number = 9, endHour: number = 18, interval: number = 30) => {
  const slots = [];
  let current = setMinutes(setHours(new Date(), startHour), 0);
  const end = setMinutes(setHours(new Date(), endHour), 0);

  while (current <= end) {  //comparison happends by automactily converting it into millisecond timstamp 
    slots.push({
      time: format(current, "hh:mm a"),  //will format to 12 hrs
      timeShort: format(current, "h a").replace(" ", ""),
      value: format(current, "HH:mm"),   //24hrs 
    });
    current = addMinutes(current, interval);
  }
  return slots;
};

export const dateTime = (date: string, time: string) => {

  const [day, month, year] = date.split("-").map(Number) as [number, number, number];
  const [hours, minutes] = time.split(":").map(Number) as [number, number];

  return new Date(year, month - 1, day, hours, minutes);
};

export const DayName = (date: string) => {

  const [day, month, year] = date.split("-").map(Number) as [number, number, number];
  const dateObj = new Date(year, month - 1, day);
  return format(dateObj, "EEEE") as Day;

};



export const splitDateTime = (scheduledAt: string | Date) => {
  const dateObj = new Date(scheduledAt);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`, // e.g. "18-05-2025"
    time: `${hours}:${minutes}`,     // e.g. "18:00"
  };
};