import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export default function AppLayout() {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)

  const getTitle = () => {
    if (location.pathname === '/dashboard') return 'Мои документы'
    if (location.pathname.startsWith('/documents')) return 'Редактирование'
    if (location.pathname === '/profile') return 'Профиль'
    return ''
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h3>📊 Таблицы</h3>
        <nav>
          <Link to="/dashboard">Документы</Link>
          <Link to="/profile">Профиль</Link>
        </nav>
        {user && <div className="user-name">{user.name}</div>}
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