import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import AuthService from "@/services/AuthService";
import type { Dispute, DisputeListPayload, DisputeListResponse } from "@/shared/types/dispute";
import type { DisputeStatus, DisputeType } from "@/shared/enums/Dispute";
import axios from "axios";
import { DLPP } from "@/utils/constant";
import { toast } from "react-toastify";

export const fetchDisputes = createAsyncThunk<
	DisputeListResponse,
	DisputeListPayload,
	{ rejectValue: string }
>("disputes/fetchDisputes", async (payload, { rejectWithValue }) => {
  try {
    const res = await AuthService.getDispute(payload);
    return res.data;
  } catch (err) {
    let errorMsg = "Failed to fetch disputes";
    if (axios.isAxiosError(err)) {
      errorMsg =
				err?.response?.data?.message || err.message || "Failed to fetch disputes";
    } else if (err instanceof Error) {
      errorMsg = err.message || "Failed to fetch disputes";
    }
    toast.error(errorMsg);
    return rejectWithValue(errorMsg);
  }
});


interface DisputeState {
	disputes: Dispute[];
	total: number;
	loading: boolean;
	error: string | null;
	filters: {
		searchQuery: string;
		type: DisputeType | "All";
		status: DisputeStatus | "All";
		page: number;
		limit: number;
	};
}

const initialState: DisputeState = {
  disputes: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    searchQuery: "",
    type: "All",
    status: "All",
    page: 1,
    limit: DLPP,
  },
};

const disputeSlice = createSlice({
  name: "disputes",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<DisputeState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDisputes(state) {
      state.disputes = [];
      state.total = 0;
      state.error = null;
      state.loading = false;
    },
    updateDisputeStatus(state, action: PayloadAction<{
			disputeId: string;
			status: DisputeStatus;
			adminNote: { name: string; action: string }
		}>) {
      const { disputeId, status, adminNote } = action.payload;
      const dispute = state.disputes.find((d) => d.disputeId === disputeId);
      if (dispute) {
        dispute.status = status;
        dispute.adminNote = adminNote;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.disputes = action.payload.disputeData;
        state.total = action.payload.total;
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { setFilters, resetDisputes, updateDisputeStatus } = disputeSlice.actions;
export default disputeSlice.reducer;
