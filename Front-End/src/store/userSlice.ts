//# Typed version
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface info {
    fname: string;
    role: string; 
}

interface AuthState {
    user: info | null;
    token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: { 
        Userinfo : (state, action : PayloadAction<{ user: info; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
})

export const { Userinfo } = userSlice.actions; 
export default userSlice.reducer;


/* UnTyped version

    import { createSlice } from "@reduxjs/toolkit";

    const userSlice = createSlice({
        name: "users",
        initialState: {
            user : JSON.parse(localStorage.getItem("user") || "null" ) ,
            token : localStorage.getItem("token")
        },
        reducers: { 
            Userinfo : (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            },
        }
    })

    export const { Userinfo } = userSlice.actions; 
    export default userSlice.reducer;
*/