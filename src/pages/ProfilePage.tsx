import { useAppSelector } from '../store/hooks'

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user)
  return (
    <div className="profile-page">
      <h2>Профиль</h2>
      <p><strong>Имя:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </div>
  )
}