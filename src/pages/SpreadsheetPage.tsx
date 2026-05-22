import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadCells } from '@/store/slices/spreadsheetSlice'
import { SpreadsheetApp } from '@/components/SpreadsheetApp'
import { useDocuments, Document } from '@/hooks/useDoc'
import NotFoundPage from '@/pages/NotFoundPage'
import type { CellStyle } from '@/store/slices/spreadsheetSlice'

const defaultStyle: CellStyle = {
  bold: false,
  italic: false,
  underline: false,
  bgColor: '#ffffff',
  textColor: '#000000',
  align: 'left',
  format: 'text'
}

const createFullStyles = (rows: number, cols: number): CellStyle[][] => {
  const styles: CellStyle[][] = []
  for (let i = 0; i < rows; i++) {
    const row: CellStyle[] = []
    for (let j = 0; j < cols; j++) {
      row.push({ ...defaultStyle })
    }
    styles.push(row)
  }
  return styles
}

export default function SpreadsheetPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { documents, loading, updateDocument } = useDocuments()
  const [doc, setDoc] = useState<Document | null>(null)
  const [status, setStatus] = useState<'loading' | 'notFound' | 'ready'>('loading')

  useEffect(() => {
    if (loading || !user) {
      setStatus('loading')
      return
    }
    
    const found = documents.find((d: Document) => d.id === documentId)
    
    if (found) {
      setDoc(found)
      const fullStyles = createFullStyles(found.rows, found.cols)
      
      dispatch(loadCells({
        cells: found.cells,
        colWidths: found.colWidths,
        cellStyles: fullStyles
      }))
      setStatus('ready')
    } else {
      setStatus('notFound')
    }
  }, [user, documents, loading, documentId, dispatch])

  const handleSave = useCallback((updates: Partial<Document>) => {
    if (doc) {
      updateDocument(doc.id, updates)
    }
  }, [doc, updateDocument])
  
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