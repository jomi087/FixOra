import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ProviderBookingsInfo } from "@/shared/Types/user";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ProviderBookingState {
    data?: ProviderBookingsInfo;
    subCategories: {
        subCategoryId: string;
        name: string;
    }[]
    isLoading: boolean;
    error: string | null;
}

const initialState:ProviderBookingState = {
  data: undefined,
  subCategories: [],
  isLoading: false,
  error : null,
};

export const fetchProviderBookingInfo  = createAsyncThunk<ProviderBookingsInfo,string>(
  "providerBooking/fetchData",
  async (providerId: string, { rejectWithValue }) => {
    try {
      const res = await AuthService.providerBookingsInfoApi(providerId);
      if (res.status === HttpStatusCode.OK) {
        return res.data.providerBookingsInfoData;
      }
    } catch (error:any) {
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA ;
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const providerBookingSlice = createSlice({
  name: "providerBooking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      if (state.data?.bookings) {
        state.data.bookings.push(action.payload);
      }
    },
    updateBookingStatus: (state, action) => {
      if (state.data?.bookings) {
        const booking = state.data.bookings.find((b) => b.bookingId === action.payload.bookingId);
        if (booking) {
          booking.status = action.payload.status;
        }
      }
    },
    removeBooking: (state, action) => { 
      if (state.data?.bookings) {
        state.data.bookings = state.data.bookings.filter((b)=>b.bookingId != action.payload);
      }
    },
    clearProviderBooking: (state) => {
      state.data = undefined;
      state.subCategories = [];
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderBookingInfo .pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderBookingInfo .fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.subCategories = action.payload.service.subcategories;
        state.isLoading = false;
      })
      .addCase(fetchProviderBookingInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addBooking,updateBookingStatus,removeBooking, clearProviderBooking } = providerBookingSlice.actions;
export default providerBookingSlice.reducer;