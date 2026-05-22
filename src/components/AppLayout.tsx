import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const getTitle = () => {
    if (location.pathname === '/dashboard') return 'Мои документы'
    if (location.pathname.startsWith('/documents')) return 'Редактирование'
    if (location.pathname === '/profile') return 'Профиль'
    return ''
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h3>Таблицы</h3>
        <nav>
          <Link to="/dashboard">Документы</Link>
          <Link to="/profile">Профиль</Link>
        </nav>
        {user && (
          <button onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
      <div className="main-content">
        <div className="breadcrumbs">
          <Link to="/dashboard">Главная</Link> / {getTitle()}
        </div>
        <Outlet />
      </div>
    </div>
  )
}