import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { useDocuments } from '../hooks/useDoc'

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { documents } = useDocuments()
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState(user?.name || '')
  const [editPassword, setEditPassword] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')

  const handleChangeName = () => {
    if (newName.trim() && user) {
      const saved = localStorage.getItem('auth_user')
      if (saved) {
        const userData = JSON.parse(saved) as { id: string; name: string; email: string }
        userData.name = newName
        localStorage.setItem('auth_user', JSON.stringify(userData))
      }
      const users: StoredUser[] = JSON.parse(localStorage.getItem('auth_users') || '[]')
      const idx = users.findIndex((u: StoredUser) => u.id === user.id)
      if (idx !== -1) users[idx].name = newName
      localStorage.setItem('auth_users', JSON.stringify(users))
    }
    setEditName(false)
  }

  const handleChangePassword = () => {
    if (!user) return
    
    if (newPass.length < 8) {
      setError('Пароль минимум 8 символов')
      return
    }
    if (newPass !== confirmPass) {
      setError('Пароли не совпадают')
      return
    }
    const users: StoredUser[] = JSON.parse(localStorage.getItem('auth_users') || '[]')
    const idx = users.findIndex((u: StoredUser) => u.id === user.id)
    if (idx !== -1) users[idx].password = newPass
    localStorage.setItem('auth_users', JSON.stringify(users))
    setEditPassword(false)
    setNewPass('')
    setConfirmPass('')
    setError('')
    alert('Пароль изменён')
  }
  
  const regDate = user?.id ? new Date(parseInt(user.id)).toLocaleDateString() : ''

  return (
    <div className="profile-page">
      <h2>Профиль</h2>
      
      <div className="profile-info">
        <p><strong>Имя:</strong> {user?.name} <button onClick={() => setEditName(true)}>✏️</button></p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Документов:</strong> {documents.length}</p>
        <p><strong>Дата регистрации:</strong> {regDate}</p>
      </div>
      
      {editName && (
        <div className="profile-modal">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={handleChangeName}>Сохранить</button>
          <button onClick={() => setEditName(false)}>Отмена</button>
        </div>
      )}
      
      <div className="profile-password">
        <button onClick={() => setEditPassword(true)}>Сменить пароль</button>
      </div>
      
      {editPassword && (
        <div className="profile-modal">
          {error && <p className="error">{error}</p>}
          <input type="password" placeholder="Новый пароль" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <input type="password" placeholder="Подтвердите пароль" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
          <button onClick={handleChangePassword}>Сохранить</button>
          <button onClick={() => setEditPassword(false)}>Отмена</button>
        </div>
      )}
    </div>
  )
}