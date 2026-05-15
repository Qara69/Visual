import { describe, test, expect } from 'vitest'
import authReducer, {
  setUser,
  logout,
  setLoading
} from '../store/slices/authSlice'

describe('authSlice', () => {
  const initialState = {
    user: { id: '1', name: 'Mock User', email: 'user@example.com' },
    isAuthenticated: true,
    loading: false
  }

  test('setUser - устанавливает пользователя', () => {
    const user = { name: 'New User', email: 'new@example.com' }
    const next = authReducer(initialState, setUser(user))
    expect(next.user?.name).toBe('New User')
    expect(next.isAuthenticated).toBe(true)
  })

  test('logout - выходит из системы', () => {
    const next = authReducer(initialState, logout())
    expect(next.user).toBeNull()
    expect(next.isAuthenticated).toBe(false)
  })

  test('setLoading - устанавливает состояние загрузки', () => {
    const next = authReducer(initialState, setLoading(true))
    expect(next.loading).toBe(true)
  })
})