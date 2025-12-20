import AuthService from "@/services/AuthService";
import type { BookingStatus } from "@/shared/enums/BookingStatus";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ConfirmJobBookings } from "@/shared/typess/booking";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export interface UpdateConfirmedBookingPayload {
  bookingId: string;
  scheduledAt: string; // or Date
  status: BookingStatus;
}

interface providerBookingState {
  data: ConfirmJobBookings[];
  isLoading: boolean;
  error: string | null;
}

const initialState: providerBookingState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchProviderBookingsInfo = createAsyncThunk<
  ConfirmJobBookings[],   // Return type
  void,                   // Argument type
  { rejectValue: string } // Optional rejected value type
>(
  "providerBookingInfo/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.providerBookingsInfoApi();
      if (res.status === HttpStatusCode.OK) {
        return res.data.providerBookingsInfoData;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      return rejectWithValue(errorMsg);
    }
  }
);

const providerBookingSlice = createSlice({
  name: "providerBookingInfo",
  initialState,
  reducers: {
    addConfirmedBooking: (state, action: PayloadAction<ConfirmJobBookings>) => {
      state.data.push(action.payload);
    },
    updateConfirmedBooking: (state, action: PayloadAction<UpdateConfirmedBookingPayload>) => {
      if (state.data) {
        const booking = state.data.find((cb) => cb.bookingId === action.payload.bookingId);
        if (booking) {
          booking.scheduledAt = action.payload.scheduledAt;
          booking.status = action.payload.status;
        }
      }
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((b) => b.bookingId != action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderBookingsInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderBookingsInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProviderBookingsInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addConfirmedBooking, updateConfirmedBooking, removeBooking } = providerBookingSlice.actions;
export default providerBookingSlice.reducer;


