//This is a version with createAsyncThunk [Regular version given below]
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/shared/Types/category";
import AuthService from '@/services/AuthService';
import { toast } from 'react-toastify';

interface CategoryState{
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error : null
}

//Thunk logic
export const fetchCategories = createAsyncThunk( 
    "category/fetchCategories", //"sliceName/action" ->  Redux action type string Redux uses it internally to log actions and identify which action is being dispatched.
    async (_, { rejectWithValue }) => {
        try {
            const res = await AuthService.getActiveServicesApi()
            if (res.status === 200) {
                return res.data.servicesData
            }
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message || "Failed to load categories";
            toast.error(errorMsg)
            return rejectWithValue(errorMsg);
        }
    }
)

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string
        })
    }
    
})

export default categorySlice.reducer;

/* This is regular way i used to do 

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/shared/Types/category";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};


const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
    },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;

*/