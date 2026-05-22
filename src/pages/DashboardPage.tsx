import { useNavigate } from 'react-router-dom'
import { Dashboard } from '@/components/Dashboard'
import { useDocuments, type Document } from '@/hooks/useDoc'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { documents, createDocument, deleteDocument, duplicateDocument, renameDocument, importDocument, getPreview } = useDocuments()

  const handleOpenDocument = (doc: Document) => {
    navigate(`/documents/${doc.id}`)
  }

  const handleCreateDocument = (name: string, rows: number, cols: number) => {
    const newDoc = createDocument(name, rows, cols)
    navigate(`/documents/${newDoc.id}`)
  }

  return (
    <Dashboard
      documents={documents}
      onOpenDocument={handleOpenDocument}
      onCreateDocument={handleCreateDocument}
      onDeleteDocument={deleteDocument}
      onDuplicateDocument={duplicateDocument}
      onRenameDocument={renameDocument}
      onImportDocument={importDocument}
      getPreview={getPreview}
    />
  )
}