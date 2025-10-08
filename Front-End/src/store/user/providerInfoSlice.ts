import AuthService from "@/services/AuthService";
import type { ProviderInfo, providerReviews } from "@/shared/Types/user";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


interface ProviderInfoState {
  data: ProviderInfo | null;
  reviews: providerReviews[];
  totalPages: number,
  subCategories: {
    subCategoryId: string;
    name: string;
  }[]
  isLoadingProvider: boolean;
  isLoadingReviews: boolean;
  error: string | null;
}

const initialState: ProviderInfoState = {
  data: null,
  reviews: [],
  totalPages: 1,
  subCategories: [],
  isLoadingProvider: false,
  isLoadingReviews: false,
  error: null,
};

export const fetchProviderInfo = createAsyncThunk<ProviderInfo, string>(
  "providerInfo/fetchData",
  async (providerId: string, { rejectWithValue }) => {
    try {
      const res = await AuthService.providerInfoApi(providerId);
      return res.data.providerInfoData;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);


export const fetchProviderReviews = createAsyncThunk<
  { reviews: providerReviews[]; totalPages: number },
  { providerId: string; currentPage: number; itemsPerPage: number }
>(
  "providerReviews/fetchData",
  async ({ providerId, currentPage, itemsPerPage }, { rejectWithValue }) => {
    try {
      const res = await AuthService.providerReviewApi(providerId, currentPage, itemsPerPage);
      return {
        reviews: res.data.providerReviewData,
        totalPages: res.data.totalPages,
      };
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      return rejectWithValue(errorMsg);
    }
  }
);



const providerInfoSlice = createSlice({
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
        const booking = state.data.bookings.find((b) => b.bookingId === action.payload.bookingId);
        if (booking) {
          booking.status = action.payload.status;
        }
      }
    },
    removeBooking: (state, action) => {
      if (state.data?.bookings) {
        state.data.bookings = state.data.bookings.filter((b) => b.bookingId != action.payload);
      }
    },
    clearProviderInfo: (state) => {
      state.data = null;
      state.subCategories = [];
      state.isLoadingProvider = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchprovider
      .addCase(fetchProviderInfo.pending, (state) => {
        state.isLoadingProvider = true;
        state.error = null;
      })
      .addCase(fetchProviderInfo.fulfilled, (state, action) => {
        state.isLoadingProvider = false;
        state.data = action.payload;
        state.subCategories = action.payload.service.subcategories;
      })
      .addCase(fetchProviderInfo.rejected, (state, action) => {
        state.isLoadingProvider = false;
        state.error = action.payload as string;
      })

      //fetchProviderReviews
      .addCase(fetchProviderReviews.pending, (state) => {
        state.isLoadingReviews = true;
        state.error = null;
      })
      .addCase(fetchProviderReviews.fulfilled, (state, action) => {
        state.isLoadingReviews = false;
        state.reviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProviderReviews.rejected, (state, action) => {
        state.isLoadingReviews = false;
        state.error = action.payload as string;
      });
  }
});

export const { addBooking, updateBookingStatus, removeBooking, clearProviderInfo } = providerInfoSlice.actions;
export default providerInfoSlice.reducer;