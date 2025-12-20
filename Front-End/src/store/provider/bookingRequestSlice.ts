import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import AuthService from "../../services/AuthService"; // adjust path as needed
import { RoleEnum } from "@/shared/enums/roles";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingRequestPayload } from "@/shared/typess/booking";
import type { info } from "../common/userSlice";

interface BookingRequestState {
    bookingDialog: BookingRequestPayload[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingRequestState = {
  bookingDialog: [],
  loading: false,
  error: null,
};

export const fetchPendingBookingRequests = createAsyncThunk<
    BookingRequestPayload[], // Return type
    info, // Arg type
    { rejectValue: string } // Reject type
>(
  "bookingRequest/fetchPendingRequests",
  async ( user , { rejectWithValue }) => {
    if (!user || user.role !== RoleEnum.PROVIDER) {
      return rejectWithValue("Unauthorized: Only providers can fetch requests.");
    }
    try {
      const res = await AuthService.pendingRequestApi();
      return res.data.pendingBookingRequestData as BookingRequestPayload[];
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || "FAILED To FETCH DATA";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const bookingRequestSlice = createSlice({
  name: "bookingRequest",
  initialState,
  reducers: {
    addBookingRequest: (state, action: PayloadAction<BookingRequestPayload>) => {
      state.bookingDialog.push(action.payload);
    },
    removeBookingRequest: (state, action: PayloadAction<{ bookingId: string }>) => {
      state.bookingDialog = state.bookingDialog.filter( (b) => b.bookingId !== action.payload.bookingId );
    },
    clearBookingRequest: (state) => {
      state.bookingDialog = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingBookingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingBookingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingDialog = [...state.bookingDialog, ...action.payload];
      })
      .addCase(fetchPendingBookingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch pending requests";
      });
  },
});

export const { addBookingRequest, removeBookingRequest, clearBookingRequest } = bookingRequestSlice.actions;
export default bookingRequestSlice.reducer;
