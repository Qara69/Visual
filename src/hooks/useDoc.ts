import { useState, useEffect } from "react"
import { useAppSelector } from '@/store/hooks'
import type { CellStyle } from '@/store/slices/spreadsheetSlice'

export interface Document {
  id: string
  name: string
  userId?: string
  cells: string[][]
  colWidths: number[]
  rows: number
  cols: number
  cellStyles: CellStyle[][]
  createdAt: string
  updatedAt: string
}

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

const defaultStyle: CellStyle = {
  bold: false,
  italic: false,
  underline: false,
  bgColor: '#ffffff',
  textColor: '#000000',
  align: 'left',
  format: 'text'
}

export function useDocuments() {
  const user = useAppSelector((state) => state.auth.user)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(`docs_${user.id}`)
    const docs: Document[] = saved ? JSON.parse(saved) : []
    setDocuments(docs)
    setLoading(false)
  }, [user])

  function saveDocuments(docs: Document[]) {
    if (user) {
      localStorage.setItem(`docs_${user.id}`, JSON.stringify(docs))
      setDocuments(docs)
    }
  }

  function createDocument(name: string, rows: number, cols: number): Document {
    const emptyCells = Array(rows).fill(null).map(() => Array(cols).fill(""))
    
    const emptyStyles: CellStyle[][] = []
    for (let i = 0; i < rows; i++) {
      const row: CellStyle[] = []
      for (let j = 0; j < cols; j++) {
        row.push({ ...defaultStyle })
      }
      emptyStyles.push(row)
    }
    
    const newDoc: Document = {
      id: Date.now().toString(),
      name,
      userId: user?.id,
      cells: emptyCells,
      colWidths: Array(cols).fill(100),
      rows,
      cols,
      cellStyles: emptyStyles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveDocuments([...documents, newDoc])
    return newDoc
  }

  function updateDocument(id: string, updates: Partial<Document>) {
    console.log('updateDocument received cellStyles length:', updates.cellStyles?.length)
    const newDocs = documents.map(doc => 
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
    )
    saveDocuments(newDocs)
  }

  function deleteDocument(id: string) {
    if (confirm("Удалить документ?")) {
      saveDocuments(documents.filter(doc => doc.id !== id))
    }
  }

  function duplicateDocument(id: string) {
    const original = documents.find(d => d.id === id)
    if (original) {
      const newDoc: Document = {
        ...original,
        id: Date.now().toString(),
        name: original.name + " (копия)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveDocuments([...documents, newDoc])
    }
  }

  function importDocument(cells: string[][], name: string) {
    const rows = cells.length
    const cols = cells[0]?.length || 26
    const fullCells = cells.map(row => {
      while (row.length < cols) row.push("")
      return row
    })
    const emptyStyles: CellStyle[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill({ ...defaultStyle })
    )
    const newDoc: Document = {
      id: Date.now().toString(),
      name,
      userId: user?.id,
      cells: fullCells,
      colWidths: Array(cols).fill(100),
      rows,
      cols,
      cellStyles: emptyStyles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveDocuments([...documents, newDoc])
  }

  function renameDocument(id: string, newName: string) {
    updateDocument(id, { name: newName })
  }

  function getPreview(doc: Document): string[][] {
    const preview: string[][] = []
    for (let i = 0; i < Math.min(3, doc.rows); i++) {
      const row: string[] = []
      for (let j = 0; j < Math.min(3, doc.cols); j++) {
        row.push(doc.cells[i]?.[j] || "")
      }
      preview.push(row)
    }
    return preview
  }

  return {
    documents,
    loading,
    createDocument,
    importDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    renameDocument,
    getPreview
  }
}