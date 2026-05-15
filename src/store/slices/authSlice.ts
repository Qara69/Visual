import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  user: { id: string; name: string; email: string } | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: { id: '1', name: 'user', email: 'dog@mail.com' },
  isAuthenticated: true,
  loading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.user = { id: Date.now().toString(), ...action.payload }
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const { setUser, logout, setLoading } = authSlice.actions
export default authSlice.reducer