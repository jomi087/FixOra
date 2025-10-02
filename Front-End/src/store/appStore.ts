//# Typed Version
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./common/userSlice";
import notificationReducer from "./common/notificationSlice";
import walletInfoReducer from "./common/walletSlice";
import categoryReducer from "./user/categorySlice";
import filterReducer from "./user/filterSlice";
import providerInfoReducer from "./user/providerInfoSlice";
import providerBookingReducer from "./provider/bookingSlice";
import availabilityReducer from "./provider/availabilitySlice";

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    wallet: walletInfoReducer,

    category: categoryReducer,
    filter: filterReducer,
    providerInfo: providerInfoReducer,

    providerBookingInfo: providerBookingReducer,
    availability: availabilityReducer,
  }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;


/*prevois version without Typed
    import { configureStore } from '@reduxjs/toolkit'

    import authReducer from './userSlice'

    const appStore = configureStore ({
        reducer: {
            auth : authReducer
        }
    })

    export default appStore
*/

