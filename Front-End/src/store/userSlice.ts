//# Typed version
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface info {
    fname: string;
    role: string; 
}

interface AuthState {
    user: info | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: { 
        Userinfo: (state, action: PayloadAction<{ user: info  }>) => { //Userinfo is for active login (user just signed in)
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        // checkAuth: (state, action: PayloadAction<{ user: info | null }>) => { //checkAuth is for verification (checking if user is still logged in like after refresh)
        //     state.user = action.payload.user;
        //     state.isAuthenticated = !!action.payload.user; // !!action.payload.user means  action.payload.user !== null;
        // }
    }
})

export const { Userinfo, logout } = userSlice.actions;
export default userSlice.reducer;



/* UnTyped version

    import { createSlice } from "@reduxjs/toolkit";

    const userSlice = createSlice({
        name: "users",
        initialState: {
            user: null,
            isAuthenticated: false
        },
        reducers: { 
            Userinfo : (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
            },
        }
    })

    export const { Userinfo } = userSlice.actions; 
    export default userSlice.reducer;
*/