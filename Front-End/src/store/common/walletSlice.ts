import AuthService from "@/services/AuthService";
import type { WalletInfo } from "@/shared/types/wallet";
import { Messages, TLPP } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";


interface walletState {
  data: WalletInfo | null;
  total: number
  isLoading: boolean;
  error: string | null;
}

const initialState: walletState = {
  data: null,
  total: 0,
  isLoading: false,
  error: null,
};

export const fetchUserWalletInfo = createAsyncThunk<
  { data: WalletInfo; total: number },
  { page?: number; limit?: number } | void,
  { rejectValue: string }
>(
  "wallet/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = TLPP|| 10 } = params || {};
      const res = await AuthService.userWalletInfoApi(page, limit);
      return {
        data: res.data.walletInfoData as WalletInfo,
        total: res.data.total,
      };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      return rejectWithValue(errorMsg);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWalletInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserWalletInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUserWalletInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Something went Wrong";
      });
  }
});


export const { } = walletSlice.actions;
export default walletSlice.reducer;