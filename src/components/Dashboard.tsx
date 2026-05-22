import { useState, useRef, ChangeEvent } from "react"
import type { Document } from '@/hooks/useDoc'

interface DashboardProps {
  documents: Document[]
  onOpenDocument: (doc: Document) => void
  onCreateDocument: (name: string, rows: number, cols: number) => void
  onDeleteDocument: (id: string) => void
  onDuplicateDocument: (id: string) => void
  onRenameDocument: (id: string, newName: string) => void
  onImportDocument: (data: string[][], name: string) => void
  getPreview: (doc: Document) => string[][]
}

export function Dashboard({ 
  documents, 
  onOpenDocument, 
  onCreateDocument, 
  onDeleteDocument, 
  onDuplicateDocument, 
  onRenameDocument, 
  onImportDocument, 
  getPreview 
}: DashboardProps) {
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRows, setNewRows] = useState(50)
  const [newCols, setNewCols] = useState(26)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const fileInput = useRef<HTMLInputElement>(null)

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return
      const data = text.split("\n")
        .filter(l => l.trim())
        .map(l => l.includes(";") ? l.split(";") : l.split(","))
      if (data.length) onImportDocument(data, file.name.replace(".csv", "").replace(".CSV", ""))
    }
    reader.readAsText(file, "UTF-8")
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImport(e.target.files[0])
    }
  }

  const handleRename = (id: string, name: string) => {
    if (name) onRenameDocument(id, name)
    setEditingId(null)
    setEditName("")
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Мои документы</h2>
        <div>
          <button onClick={() => setShowModal(true)}>+ Новый</button>
          <button onClick={() => fileInput.current?.click()}>Импорт CSV</button>
          <input 
            ref={fileInput} 
            type="file" 
            accept=".csv" 
            style={{ display: "none" }} 
            onChange={handleFileChange} 
          />
        </div>
      </div>

      <div className="docs-list">
        {documents.map((doc) => (
          <div key={doc.id} className="doc-card">
            <div onClick={() => onOpenDocument(doc)}>
              <table className="preview-table">
                <tbody>
                  {getPreview(doc).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => <td key={j}>{cell || ""}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              {editingId === doc.id ? (
                <input 
                  className="rename-input" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  onBlur={() => handleRename(doc.id, editName)} 
                  onKeyDown={(e) => e.key === "Enter" && handleRename(doc.id, editName)} 
                  autoFocus 
                />
              ) : (
                <div className="doc-name">{doc.name}</div>
              )}
              <div className="doc-dates">
                <div>Создан: {new Date(doc.createdAt).toLocaleDateString()}</div>
                <div>Изменён: {new Date(doc.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="doc-buttons">
                <button onClick={() => { setEditingId(doc.id); setEditName(doc.name) }}>✏️</button>
                <button onClick={() => onDuplicateDocument(doc.id)}>📋</button>
                <button onClick={() => onDeleteDocument(doc.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h3>Новый документ</h3>
            <input 
              placeholder="Название" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
            />
            <div className="modal-row">
              <span>Строки:</span>
              <input 
                type="number" 
                value={newRows} 
                onChange={(e) => setNewRows(Number(e.target.value))} 
              />
            </div>
            <div className="modal-row">
              <span>Столбцы:</span>
              <input 
                type="number" 
                value={newCols} 
                onChange={(e) => setNewCols(Number(e.target.value))} 
              />
            </div>
            <div>
              <button onClick={() => setShowModal(false)}>Отмена</button>
              <button onClick={() => { 
                if (newName) {
                  onCreateDocument(newName, newRows, newCols)
                  setShowModal(false)
                  setNewName("")
                }
              }}>Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}