import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ProviderInfo } from "@/shared/Types/user";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ProviderInfoState {
  data?: ProviderInfo;
  subCategories: {
      subCategoryId: string;
      name: string;
  }[]
  isLoading: boolean;
  error: string | null;
}

const initialState:ProviderInfoState = {
  data: undefined,
  subCategories: [],
  isLoading: false,
  error : null,
};

export const fetchProviderInfo  = createAsyncThunk<ProviderInfo,string>(
  "providerInfo/fetchData",
  async (providerId: string, { rejectWithValue }) => {
    try {
      const res = await AuthService.providerInfoApi(providerId);
      if (res.status === HttpStatusCode.OK) {
        return res.data.providerInfoData;
      }
    } catch (error:any) {
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA ;
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const providerInfoSlice  = createSlice({
  name: "providerInfo",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      if (state.data?.bookings) {
        state.data.bookings.push(action.payload);
      }
    },
    updateBookingStatus: (state, action) => {
      if (state.data?.bookings) {
        console.log("reached");
        console.log(action.payload);
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
    clearProviderInfo: (state) => {
      state.data = undefined;
      state.subCategories = [];
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.subCategories = action.payload.service.subcategories;
      })
      .addCase(fetchProviderInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addBooking,updateBookingStatus,removeBooking, clearProviderInfo } = providerInfoSlice .actions;
export default providerInfoSlice .reducer;