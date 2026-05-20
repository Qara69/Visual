import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { register } from '../store/slices/authSlice'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      alert('Пароли не совпадают')
      return
    }
    if (password.length < 8) {
      alert('Пароль должен быть минимум 8 символов')
      return
    }
    dispatch(register({ name, email, password }))
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Регистрация</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль (8+ символов)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Повторите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button type="submit" disabled={loading}>Зарегистрироваться</button>
        </form>
        <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
      </div>
    </div>
  )
}