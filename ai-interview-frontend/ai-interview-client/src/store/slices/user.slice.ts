import axiosInstance from "@/utils/axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface UserProfile {
    id: string;
    name: string;
    email: string;
    // Need to Add other fields returned by API
}

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null
}

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null
}

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async () => {
        const response = await axiosInstance.get('/users/profile');
        return response.data.data;
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: { name?: string }) => {
        const response = await axiosInstance.patch('/users/profile', data);
        return response.data.data;
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoading = action.payload
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'failed to fetch profile'
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload
            })
    }
});

export default userSlice.reducer;