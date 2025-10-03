import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import AuthService from "@/services/AuthService";
import type { Day, LeaveOption } from "@/shared/Types/availability";
import type { AxiosError } from "axios";
import { Messages } from "@/utils/constant";

type DaySchedule = {
  day: Day;
  slots: string[];
  active: boolean;
};

interface AvailabilityState {
  data: DaySchedule[];
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: AvailabilityState = {
  data: [],
  loading: false,
  error: null,
};

// Thunks for API calls
export const fetchAvailability = createAsyncThunk<
  DaySchedule[],
  void,
  { rejectValue: string }
>(
  "availability/fetchAvailability",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.workingTimeInfoApi();
      return res.data.availabilityData;

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      return rejectWithValue(errorMsg);
    }
  }
);

export const toggleAvailability = createAsyncThunk(
  "availability/toggleAvailability",
  async ({ day, active, leaveOption }: { day: string; active: boolean; leaveOption?: LeaveOption }, { rejectWithValue }) => {
    try {
      await AuthService.toggleAvailability(day,leaveOption);
      return { day, active };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const saveAvailability = createAsyncThunk<
  DaySchedule[],//return type
  Record<Day, { slots: string[], active: boolean }>, //argument type
  { rejectValue: string }
>(
  "availability/saveAvailability",
  async (schedule, { rejectWithValue }) => {
    try {
      const res = await AuthService.scheduleWorkTimeAPi(schedule);
      return res.data.availabilityData;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      return rejectWithValue(errorMsg);
    }
  }
);

// Slice
const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailability.fulfilled,
        (state, action: PayloadAction<DaySchedule[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Save availability
      .addCase(saveAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAvailability.fulfilled,
        (state, action: PayloadAction<DaySchedule[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(saveAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Toggle availability
      .addCase(toggleAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAvailability.fulfilled,
        (state, action: PayloadAction<{ day: string; active: boolean }>) => {
          state.loading = false;
          const schedule = state.data.find((s) => s.day === action.payload.day);
          if (schedule) {
            schedule.active = action.payload.active;
          }
        }
      )
      .addCase(toggleAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default availabilitySlice.reducer;


/*
export const { updateDaySlots } = availabilitySlice.actions;

    resetAvailability: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },

    updateDaySlots: (state, action: PayloadAction<{ day: Day; slots: string[] }>) => {
      const existing = state.data.find((d) => d.day === action.payload.day);
      if (existing) {
        existing.slots = action.payload.slots;
      } else {
        state.data.push({ day: action.payload.day, slots: action.payload.slots });
      }
    },

    */
