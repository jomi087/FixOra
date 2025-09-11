//# Typed Version
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./user/userSlice";
import categoryReducer from "./user/categorySlice";
import filterReducer from "./user/filterSlice";
import providerInfoReducer from "./user/providerInfoSlice";
import providerBookingReducer from "./provider/bookingSlice";
import walletInfoReducer from "./user/walletSlice";

const appStore = configureStore ({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    filter: filterReducer,
    providerInfo: providerInfoReducer,
    providerBookingInfo: providerBookingReducer,
    wallet: walletInfoReducer,
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

