import { describe, test, expect } from 'vitest'
import authReducer, {
  setUser,
  setLoading,
  clearError
} from '@/store/slices/authSlice'

describe('authSlice', () => {
  const initialState = {
    user: { id: '1', name: 'Mock User', email: 'user@example.com' },
    isAuthenticated: true,
    loading: false,
    error: null
  }

  test('setUser - устанавливает пользователя', () => {
    const user = { id: '2', name: 'New User', email: 'new@example.com' }
    const next = authReducer(initialState, setUser(user))
    expect(next.user?.name).toBe('New User')
    expect(next.isAuthenticated).toBe(true)
  })

  test('setLoading - устанавливает состояние загрузки', () => {
    const next = authReducer(initialState, setLoading(true))
    expect(next.loading).toBe(true)
  })

  test('clearError - очищает ошибку', () => {
    const stateWithError = { ...initialState, error: 'Some error' }
    const next = authReducer(stateWithError, clearError())
    expect(next.error).toBeNull()
  })
})