import { useState, useEffect } from "react"
import { useAppSelector } from '../store/hooks'

export function useDocuments() {
  const user = useAppSelector((state) => state.auth.user)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ждём пока user загрузится
    if (user === undefined || user === null) {
      // Не сбрасываем loading, ждём
      return
    }
  
    const saved = localStorage.getItem(`docs_${user.id}`)
    if (saved) {
      setDocuments(JSON.parse(saved))
    } else {
      setDocuments([])
    }
    setLoading(false)
    
  }, [user])

  function saveDocuments(docs: any[]) {
    if (user) {
      localStorage.setItem(`docs_${user.id}`, JSON.stringify(docs))
      setDocuments(docs)
    }
  }

  function createDocument(name: string, rows: number, cols: number) {
    const emptyCells = Array(rows).fill(null).map(() => Array(cols).fill(""))
    const newDoc = {
      id: Date.now().toString(),
      name,
      userId: user?.id,
      cells: emptyCells,
      colWidths: Array(cols).fill(100),
      rows,
      cols,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newDocs = [...documents, newDoc]
    saveDocuments(newDocs)
    return newDoc
  }

  function updateDocument(id: string, updates: any) {
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
      const newDoc = {
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
    const newDoc = {
      id: Date.now().toString(),
      name,
      userId: user?.id,
      cells: fullCells,
      colWidths: Array(cols).fill(100),
      rows,
      cols,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveDocuments([...documents, newDoc])
  }

  function renameDocument(id: string, newName: string) {
    updateDocument(id, { name: newName })
  }

  function getPreview(doc: any): string[][] {
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