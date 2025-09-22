// notificationSlice.ts
import AuthService from "@/services/AuthService";
import type { Notification } from "@/shared/Types/booking";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface NotificationState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
};


export const fetchNotifications = createAsyncThunk<
  Notification[], //return type
  void, //argument type
  { rejectValue: string }
>(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.getNotificationsApi();
      return res.data.notificationData;
    } catch (err: any) {
      console.log("fetchNotificationError", err);
      return rejectWithValue(err.message || "Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find(n => n.notificationId === action.payload);
      if (notif) notif.isRead = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Something went Wrong";
      });
  },
});

export const { addNotification,clearNotifications,markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;

/*
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif) notif.isRead = true;
    },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
    }
*/
