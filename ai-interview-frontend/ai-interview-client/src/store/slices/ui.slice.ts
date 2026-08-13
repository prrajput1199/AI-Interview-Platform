import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    isLoading: boolean;
    toast: {
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
        open: boolean;
    } | null;
}

const initialState: UIState = {
    isLoading: false,
    toast: null, 
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state,action:PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        showToast: (state, action:PayloadAction<UIState['toast']>) => {
            state.toast = action.payload;
        },
        hideToast:(state) =>{
            state.toast = null;
        }
    }
});

export const {setLoading, showToast,hideToast} = uiSlice.actions;
export default uiSlice.reducer;