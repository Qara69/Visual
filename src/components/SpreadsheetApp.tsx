import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { saveDocument } from '../store/slices/documentsSlice'
import { loadCells } from '../store/slices/spreadsheetSlice'
import { setSaveStatus } from '../store/slices/uiSlice'
import { Table } from './Table'
import { Panel } from './Panel'
import { useSpreadsheet } from '../hooks/useSpreadsheet'

export function SpreadsheetApp({ doc, onBack }: any) {
  const dispatch = useAppDispatch()
  const s = useSpreadsheet()
  const saveStatus = useAppSelector((state) => state.ui.saveStatus)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    dispatch(loadCells({ cells: doc.cells, colWidths: doc.colWidths }))
  }, [doc, dispatch])

  useEffect(() => {
    if (s.cells.length) setHasChanges(true)
  }, [s.cells, s.colWidths])

  const handleSave = useCallback(() => {
    if (!hasChanges) return
    dispatch(setSaveStatus('saving'))
    try {
      dispatch(saveDocument({ id: doc.id, updates: { cells: s.cells, colWidths: s.colWidths } }))
      dispatch(setSaveStatus('saved'))
      setHasChanges(false)
    } catch {
      dispatch(setSaveStatus('error'))
    }
  }, [hasChanges, s.cells, s.colWidths, doc.id, dispatch])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        e.stopPropagation()
        handleSave()
        return false
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleSave])

  useEffect(() => {
    const handleBefore = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBefore)
    return () => window.removeEventListener('beforeunload', handleBefore)
  }, [hasChanges])

  const exportCSV = () => {
    const rows = s.cells.map((row, i) => row.map((_, j) => s.display[i][j]).join(','))
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${doc.name}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const exportJSON = () => {
    const data = { name: doc.name, cells: s.cells, colWidths: s.colWidths }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${doc.name}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (!s.cells.length) return <div style={{ padding: 20 }}>Загрузка...</div>

  return (
    <div className="app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <span>{doc.name}</span>
        <span className="save-status">
          {saveStatus === 'saved' && hasChanges && 'Есть изменения'}
          {saveStatus === 'saved' && !hasChanges && 'Сохранено'}
          {saveStatus === 'saving' && 'Сохранение...'}
          {saveStatus === 'error' && 'Ошибка'}
        </span>
        <div className="header-buttons">
          <button className="btn-small" onClick={exportCSV}>CSV</button>
          <button className="btn-small" onClick={exportJSON}>JSON</button>
        </div>
      </div>
      <Panel address={s.address} value={s.currentValue} />
      <Table {...s} containerHeight={600} />
    </div>
  )
}