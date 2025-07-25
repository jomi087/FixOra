//# Typed Version
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './user/userSlice';
import categoryReducer from './user/categorySlice';
import filterReducer from './user/filterSlice';


const appStore = configureStore ({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        filter: filterReducer,
    }
})

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore


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

