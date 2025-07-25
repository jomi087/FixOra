import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    selectedService: string
    nearByFilter: string
    availabilityFilter: string
    ratingFilter : string
}

const initialState: FilterState = {
    selectedService: "",
    nearByFilter: "",
    availabilityFilter: "",
    ratingFilter : "",
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSelectedService(state, action: PayloadAction<string>) {
            state.selectedService = action.payload;
        },
        setNearByFilter(state, action: PayloadAction<string>) {
            state.nearByFilter = action.payload;
        },
        setAvailabilityFilter(state, action: PayloadAction<string>) {
            state.availabilityFilter = action.payload;
        },
        setRatingFilter(state, action: PayloadAction<string>) {
            state.ratingFilter = action.payload;
        },
        resetFilters() {
            return initialState;
        }
    }
})

export const { setSelectedService, setNearByFilter, setAvailabilityFilter, setRatingFilter, resetFilters } = filterSlice.actions

export default filterSlice.reducer;