import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { SpreadsheetApp } from '../components/SpreadsheetApp'
import { useDocuments } from '../hooks/useDoc'
import NotFoundPage from './NotFoundPage'

export default function SpreadsheetPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const { documents, loading, updateDocument } = useDocuments()
  const [doc, setDoc] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'notFound' | 'ready'>('loading')

  useEffect(() => {
    if (loading || !user) {
      setStatus('loading')
      return
    }
    
    const found = documents.find((d: any) => d.id === documentId)
    
    if (found) {
      setDoc(found)
      setStatus('ready')
    } else {
      setStatus('notFound')
    }
  }, [user, documents, loading, documentId])

  const handleSave = (updates: { cells: string[][]; colWidths: number[] }) => {
    if (doc) {
      updateDocument(doc.id, updates)
    }
  }
  
  if (status === 'notFound') {
    return <NotFoundPage />
  }
  
  if (!doc) return <div>Загрузка...</div>

  return (
    <SpreadsheetApp
      doc={doc}
      onSave={handleSave}
      onBack={() => navigate('/dashboard')}
    />
  )
}