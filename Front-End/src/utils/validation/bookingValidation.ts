export const validateBookingTime = (scheduledAt: string | Date): string | null => {
  const dateObj = new Date(scheduledAt);
  const now = Date.now();
  console.log(now);
  console.log(dateObj.getTime());
  //if (now > scheduleAt) return "hiu";
  return null;
}; 

/*
    let error = validateBookingTime(bookingInDetails.scheduledAt);
    if (error) {
      toast.error(error);
*/