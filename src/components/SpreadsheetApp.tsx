import { useEffect, useRef, useState } from "react"
import { useSpreadsheet } from "../hooks/useSpreadsheet"
import { Table } from "./Table"
import { Panel } from "./Panel"
import { Document } from "../types/types"

type Props = {
  doc: Document
  onSave: (updates: Partial<Document>) => void
  onBack: () => void
}

export function SpreadsheetApp({ doc, onSave, onBack }: Props) {
  const s = useSpreadsheet(doc.cells, doc.colWidths)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setHasChanges(true)
    setSaveStatus("saved")
  }, [s.cells, s.colWidths])

  function saveDocument() {
    if (!hasChanges) return
    
    setSaveStatus("saving")
    try {
      onSave({
        cells: s.cells,
        colWidths: s.colWidths,
        updatedAt: new Date().toISOString()
      })
      setSaveStatus("saved")
      setHasChanges(false)
    } catch {
      setSaveStatus("error")
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveDocument()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [s.cells, s.colWidths, hasChanges])


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

  function exportCSV() {
    const rows = []
    for (let r = 0; r < s.cells.length; r++) {
      const row = []
      for (let c = 0; c < s.cells[r].length; c++) {
        let val = s.display[r][c]
        row.push(val)
      }
      rows.push(row.join(","))
    }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.name}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportJSON() {
    const data = {
      name: doc.name,
      cells: s.cells,
      colWidths: s.colWidths,
      rows: s.cells.length,
      cols: s.cells[0].length,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.name}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <span>{doc.name}</span>
        <span className={`save-status status-${saveStatus}`}>
          {saveStatus === "saved" && hasChanges && "Есть изменения"}
          {saveStatus === "saved" && !hasChanges && "Сохранено"}
          {saveStatus === "saving" && "Сохранение..."}
          {saveStatus === "error" && "Ошибка"}
        </span>
        <div className="header-buttons">
          <button className="btn-small" onClick={exportCSV}>CSV</button>
          <button className="btn-small" onClick={exportJSON}>JSON</button>
        </div>
      </div>
      <Panel address={s.address} value={s.currentValue} />
      <Table
        cells={s.cells}
        display={s.display}
        colWidths={s.colWidths}
        selectedCol={s.selectedCol}
        selectedRow={s.selectedRow}
        editing={s.editing}
        editText={s.editText}
        scrollTop={s.scrollTop}
        containerHeight={600}
        menu={s.menu}
        isInRange={s.isInRange}
        onSelectCell={s.selectCell}
        onDoubleClick={s.startEdit}
        onSave={s.saveEdit}
        onChangeText={s.changeEditText}
        onResize={s.resizeColumn}
        onAddRowAt={s.addRowAt}
        onDeleteRowAt={s.deleteRowAt}
        onAddColAt={s.addColAt}
        onDeleteColAt={s.deleteColAt}
        onOpenRowMenu={s.openRowMenu}
        onOpenColMenu={s.openColMenu}
        onCloseMenu={s.closeMenu}
        onKeyDown={s.handleKeyDown}
        onScroll={s.handleScroll}
      />
    </div>
  )
}