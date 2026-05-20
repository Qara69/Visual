import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { login } from '../store/slices/authSlice'


export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Вход</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Войти'}</button>
        </form>
        <p>Нет аккаунта? <a href="/register">Регистрация</a></p>
      </div>
    </div>
  )
}