import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from "../../utils/axios";

interface AuthState {
    user?: any;
    isloading: boolean,
    isAuthenticated: boolean,
    error: string | null;
}

const initialState : AuthState ={
    user: null,
    isloading: false,
    isAuthenticated: false,
    error: null
}

export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (idToken: string) => {
        const response = await axiosInstance.post('auth/google',{idToken});
        return response.data.data.user;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await axiosInstance.post('/auth/logout')
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) =>{
            state.error = null
        }
    },
    extraReducers: (builder) => {
     builder
        .addCase(loginWithGoogle.pending, (state) => {
            state.isloading = true;
            state.error = null; 
        })
        .addCase(loginWithGoogle.fulfilled,(state, action) =>{
            state.isloading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        })
        .addCase(loginWithGoogle.rejected, (state, action) => {
            state.isloading = false;
            state.error = action.error.message || 'Login Failed'
        })
        .addCase(logout.fulfilled, (state) =>{
            state.user = null;
            state.isAuthenticated = false
        })
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;