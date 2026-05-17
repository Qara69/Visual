import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchDocuments, saveDocument, setActiveDocument } from '../store/slices/documentsSlice'
import { SpreadsheetApp } from '../components/SpreadsheetApp'

export default function SpreadsheetPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { list, loading } = useAppSelector((state) => state.documents)
  const [doc, setDoc] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    dispatch(fetchDocuments())
  }, [dispatch])

  useEffect(() => {
    if (!loading && list.length > 0) {
      const found = list.find((d: any) => d.id === documentId)
      if (found) {
        setDoc(found)
        dispatch(setActiveDocument(found))
      } else {
        navigate('/404')
      }
    }
  }, [documentId, list, loading, navigate, dispatch])

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm('Есть несохранённые изменения. Выйти без сохранения?')) {
        navigate('/dashboard')
      }
    } else {
      navigate('/dashboard')
    }
  }

  const handleSave = (updates: any) => {
    if (doc) {
      dispatch(saveDocument({ id: doc.id, updates }))
      setHasUnsavedChanges(false)
    }
  }

  const handleChange = () => {
    setHasUnsavedChanges(true)
  }

  return (
    <SpreadsheetApp
      doc={doc}
      onSave={handleSave}
      onBack={handleBack}
      onChange={handleChange}
    />
  )
}