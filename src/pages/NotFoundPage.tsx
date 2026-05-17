import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>404 - Страница не найдена</h2>
      <Link to="/dashboard">← На главную</Link>
    </div>
  )
}