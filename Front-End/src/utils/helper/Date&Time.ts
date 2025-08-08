import { format, setHours, setMinutes, addDays, addMinutes } from "date-fns";

//Date
export const generateDateList = (days:number = 7) => {
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
export const generateTimeSlots = (startHour:number = 9, endHour:number = 18, interval:number = 30) => {
    const slots = []
    let current = setMinutes(setHours(new Date(), startHour), 0);
    const end = setMinutes(setHours(new Date(), endHour), 0);

    while (current <= end) {  //comparison happends by automactily converting it into millisecond timstamp 
        slots.push({
            time: format(current, "hh:mm a"),  //will format to 12 hrs
            timeShort: format(current, "h a").replace(' ', ''), 
            value: format(current, "HH:mm"),   //24hrs 
        });
        current = addMinutes(current, interval);
    }
    return slots;
}
