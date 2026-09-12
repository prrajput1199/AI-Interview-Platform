import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/user'

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: AuthStatus
}

const initialState: AuthState = {
  user: null,
  status: 'unknown',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      state.status = action.payload ? 'authenticated' : 'unauthenticated'
    },
    clearSession(state) {
      state.user = null
      state.status = 'unauthenticated'
    },
  },
})

export const { setUser, clearSession } = authSlice.actions
export default authSlice.reducer