import { useState, useEffect } from "react"
import { Document } from "../types/types"

const STORAGE_KEY = "spreadsheet_docs"

export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setDocuments(parsed)
    } else {
      const rows = 100
      const cols = 26
      const emptyCells = []
      for (let i = 0; i < rows; i++) {
        const row = []
        for (let j = 0; j < cols; j++) {
          row.push("")
        }
        emptyCells.push(row)
      }
      
      const demoDoc = {
        id: "1",
        name: "Моя первая таблица",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cells: emptyCells,
        colWidths: Array(cols).fill(100),
        rows: rows,
        cols: cols
      }
      setDocuments([demoDoc])
      localStorage.setItem(STORAGE_KEY, JSON.stringify([demoDoc]))
    }
    setLoading(false)
  }, [])

  function saveDocuments(docs: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
    setDocuments(docs)
  }

  function createDocument(name: string, rows: number, cols: number) {
    const emptyCells = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push("")
      }
      emptyCells.push(row)
    }
    
    const newDoc = {
      id: Date.now().toString(),
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cells: emptyCells,
      colWidths: Array(cols).fill(100),
      rows: rows,
      cols: cols
    }
    saveDocuments([...documents, newDoc])
    return newDoc
  }

  function importDocument(cells: string[][], name: string) {
    const rows = cells.length
    const cols = cells[0]?.length || 26
    
    const fullCells = []
    for (let i = 0; i < cells.length; i++) {
      const row = [...cells[i]]
      while (row.length < cols) {
        row.push("")
      }
      fullCells.push(row)
    }
    
    const newDoc = {
      id: Date.now().toString(),
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cells: fullCells,
      colWidths: Array(cols).fill(100),
      rows: rows,
      cols: cols
    }
    saveDocuments([...documents, newDoc])
    return newDoc
  }

  function updateDocument(id: string, updates: any) {
    const newDocs = documents.map(function(doc) {
      if (doc.id === id) {
        return { ...doc, ...updates, updatedAt: new Date().toISOString() }
      }
      return doc
    })
    saveDocuments(newDocs)
  }

  function deleteDocument(id: string) {
    if (confirm("Удалить документ?")) {
      const newDocs = []
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].id !== id) {
          newDocs.push(documents[i])
        }
      }
      saveDocuments(newDocs)
    }
  }

  function duplicateDocument(id: string) {
    let original = null
    for (let i = 0; i < documents.length; i++) {
      if (documents[i].id === id) {
        original = documents[i]
        break
      }
    }
    
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

  function getPreview(doc: any): string[][] {
    const preview = []
    const maxRows = Math.min(3, doc.rows)
    const maxCols = Math.min(3, doc.cols)
    
    for (let i = 0; i < maxRows; i++) {
      const row = []
      for (let j = 0; j < maxCols; j++) {
        const val = doc.cells[i]?.[j] || ""
        row.push(val)
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
    getPreview
  }
}