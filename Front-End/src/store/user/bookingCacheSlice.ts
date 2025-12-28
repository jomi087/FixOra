
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingInfoDetails } from "@/shared/types/booking";


interface BookingDetailsCache {
	details: {
		[bookingId: string]: BookingInfoDetails;
	}
}

const initialState: BookingDetailsCache = {
  details: {}
};

const bookingCacheSlice = createSlice({
  name: "bookingCache",
  initialState,
  reducers: {
    cacheBookingDetails: (state, action: PayloadAction<{ bookingId: string; details: BookingInfoDetails }>) => {
      state.details[action.payload.bookingId] = action.payload.details;
    },
  },
});

export const { cacheBookingDetails } = bookingCacheSlice.actions;
export default bookingCacheSlice.reducer;
