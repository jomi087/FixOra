//# Typed Version
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './userSlice'

const appStore = configureStore ({
    reducer: {
        auth : authReducer
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

