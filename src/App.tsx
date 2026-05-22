import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { restoreSession } from '@/store/slices/authSlice'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return <RouterProvider router={router} />
}