//# Typed version
import type { AddressWithCoordinates } from "@/shared/Types/location";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface info {
    fname: string;
    lname: string;
    email: string;
    mobileNo: string;
    role: string; 
    location?: AddressWithCoordinates;
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