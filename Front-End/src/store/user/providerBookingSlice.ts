import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { ProviderBookingsInfoDTO } from "@/shared/Types/user";
import { Messages } from "@/utils/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ProviderBookingState {
    data?: ProviderBookingsInfoDTO;
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
}

export const fetchProviderBookingInfo  = createAsyncThunk<ProviderBookingsInfoDTO,string>(
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
)

const providerBookingSlice = createSlice({
    name: "providerBooking",
    initialState,
    reducers: {
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
        })
    }
})

export const { clearProviderBooking } = providerBookingSlice.actions
export default providerBookingSlice.reducer