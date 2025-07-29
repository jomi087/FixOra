import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface FilterState {
    selectedService: string;
    nearByFilter: string;
    availabilityFilter: string;
    ratingFilter: string;
        
    applyFilter: boolean;
    reset: boolean;
}

const initialState: FilterState = {
    selectedService: "",
    nearByFilter: "",
    availabilityFilter: "",
    ratingFilter: "",

    applyFilter: false,
    reset: false,
};

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
    
    setApplyFilters(state, action: PayloadAction<boolean>) {
      state.applyFilter = action.payload;
    },
    
    setReset(_, action: PayloadAction<boolean>) {
        return {
            ...initialState,
            reset: action.payload,
        }; 
    },
  },
});

export const {
  setSelectedService,
  setNearByFilter,
  setAvailabilityFilter,
  setRatingFilter,
  setApplyFilters,
  setReset,
} = filterSlice.actions;

export default filterSlice.reducer;
