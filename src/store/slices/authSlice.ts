import { createSlice, createAsyncThunk, PayloadAction, Dispatch} from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

// Тип для пользователя в хранилище
interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

let users: StoredUser[] = []

const savedUsers = localStorage.getItem('auth_users')
if (savedUsers) users = JSON.parse(savedUsers)

function saveUsers(): void {
  localStorage.setItem('auth_users', JSON.stringify(users))
}

function createDemoDocs(userId: string): void {
  const emptyCells = Array(100).fill(null).map(() => Array(26).fill(""))
  const demoDoc = {
    id: Date.now().toString(),
    name: "Моя первая таблица",
    userId,
    cells: emptyCells,
    colWidths: Array(26).fill(100),
    rows: 100,
    cols: 26,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem(`docs_${userId}`, JSON.stringify([demoDoc]))
}

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    if (users.find(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует')
    }
    if (password.length < 8) {
      throw new Error('Пароль минимум 8 символов')
    }
    
    const newUser: StoredUser = { id: Date.now().toString(), name, email, password }
    users.push(newUser)
    saveUsers()
    createDemoDocs(newUser.id)
    
    localStorage.setItem('auth_user', JSON.stringify({ id: newUser.id, name, email }))
    
    return { user: { id: newUser.id, name, email } }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = users.find(u => u.email === email)
    if (!user || user.password !== password) {
      throw new Error('Неверный email или пароль')
    }
    
    localStorage.setItem('auth_user', JSON.stringify({ id: user.id, name: user.name, email: user.email }))
    
    return { user: { id: user.id, name: user.name, email: user.email } }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('auth_user')
  return null
})

export const restoreSession = () => (dispatch: Dispatch) => {
  const savedUser = localStorage.getItem('auth_user')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    dispatch(setUser(user))
  } else {
    dispatch(setLoading(false))
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Ошибка регистрации'
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Ошибка входа'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
  }
})

export const { clearError, setUser, setLoading } = authSlice.actions
export default authSlice.reducer
export type { AuthState }