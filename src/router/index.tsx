import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import SpreadsheetPage from '../pages/SpreadsheetPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from '../components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: 'documents/:documentId', element: <ProtectedRoute><SpreadsheetPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> }
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> }
])