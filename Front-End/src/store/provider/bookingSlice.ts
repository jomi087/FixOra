// src/store/slices/bookingSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingRequestPayload, BookingAutoRejectPayload } from "@/shared/Types/booking";

interface BookingState {
  requests: BookingRequestPayload[];
  notifications: string[]; // simple notification messages, you can expand later
}

const initialState: BookingState = {
  requests: [],
  notifications: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBookingRequest: (state, action: PayloadAction<BookingRequestPayload>) => {
      state.requests.push(action.payload);
      state.notifications.push(`New booking request from ${action.payload.userName}`);
    },
    removeBookingRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((b) => b.bookingId !== action.payload);
    },
    autoRejectBooking: (state, action: PayloadAction<BookingAutoRejectPayload>) => {
      state.requests = state.requests.filter((b) => b.bookingId !== action.payload.bookingId);
      state.notifications.push(`Booking ${action.payload.bookingId} auto-rejected: ${action.payload.reason}`);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addBookingRequest, removeBookingRequest, autoRejectBooking, clearNotifications } =
  bookingSlice.actions;
export default bookingSlice.reducer;
