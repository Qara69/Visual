import { useState } from "react"
import { Dashboard } from "./components/Dashboard"
import { SpreadsheetApp } from "./components/SpreadsheetApp"
import { useDocuments } from "./hooks/useDoc"
import { Document } from "./types/types"

export function App() {
  const { documents, createDocument, deleteDocument, duplicateDocument, updateDocument, importDocument, getPreview } = useDocuments()
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)

  function renameDocument(id: string, newName: string) {
    updateDocument(id, { name: newName })
  }

  if (currentDoc) {
    return (
      <SpreadsheetApp 
        doc={currentDoc} 
        onSave={(updates: Partial<Document>) => {
          updateDocument(currentDoc.id, updates)
        }}
        onBack={() => setCurrentDoc(null)}
      />
    )
  }

  return (
    <Dashboard
      documents={documents}
      onOpenDocument={setCurrentDoc}
      onCreateDocument={createDocument}
      onDeleteDocument={deleteDocument}
      onDuplicateDocument={duplicateDocument}
      onRenameDocument={renameDocument}
      onImportDocument={importDocument}
      getPreview={getPreview}
    />
  )
}