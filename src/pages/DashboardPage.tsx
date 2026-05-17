import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchDocuments, createDocument, deleteDocument, duplicateDocument, renameDocument } from '../store/slices/documentsSlice'
import { Dashboard } from '../components/Dashboard'

export default function DashboardPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { list, loading } = useAppSelector((state) => state.documents)

  useEffect(() => {
    dispatch(fetchDocuments())
  }, [dispatch])

  const handleOpenDocument = (doc: any) => {
    navigate(`/documents/${doc.id}`)
  }

  const handleCreateDocument = (name: string, rows: number, cols: number) => {
    dispatch(createDocument({ name, rows, cols })).then((action: any) => {
      if (action.payload) {
        navigate(`/documents/${action.payload.id}`)
      }
    })
  }

  const handleDeleteDocument = (id: string) => {
    dispatch(deleteDocument(id))
  }

  const handleDuplicateDocument = (id: string) => {
    dispatch(duplicateDocument(id))
  }

  const handleRenameDocument = (id: string, newName: string) => {
    dispatch(renameDocument({ id, newName }))
  }

  const handleImportDocument = (cells: string[][], name: string) => {
    console.log('Import:', cells, name)
  }

  const getPreview = (doc: any) => {
    const preview = []
    for (let i = 0; i < Math.min(3, doc.rows); i++) {
      const row = []
      for (let j = 0; j < Math.min(3, doc.cols); j++) {
        row.push(doc.cells[i]?.[j] || "")
      }
      preview.push(row)
    }
    return preview
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <Dashboard
      documents={list}
      onOpenDocument={handleOpenDocument}
      onCreateDocument={handleCreateDocument}
      onDeleteDocument={handleDeleteDocument}
      onDuplicateDocument={handleDuplicateDocument}
      onRenameDocument={handleRenameDocument}
      onImportDocument={handleImportDocument}
      getPreview={getPreview}
    />
  )
}