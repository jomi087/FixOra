import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ConfirmBookingInfo } from "@/shared/Types/booking";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

interface providerBookingState {
  data: ConfirmBookingInfo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: providerBookingState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchProviderBookingsInfo = createAsyncThunk(
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
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const providerBookingSlice = createSlice({
  name: "providerBookingInfo",
  initialState,
  reducers: {
    addConfirmedBooking: (state, action) => {
      state.data.push(action.payload);
    }
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

export const { addConfirmedBooking } = providerBookingSlice.actions;
export default providerBookingSlice.reducer;


