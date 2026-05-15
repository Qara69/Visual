import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { calculateFormula, getCellAddress } from '../tools/calculator'
import {
  updateCell,
  setDisplay,
  selectCell,
  startEditing,
  stopEditing,
  setEditText,
  resizeColumn,
  addRowBelow,
  deleteRow,
  addColumnRight,
  deleteColumn,
  setScrollTop,
  openMenu,
  closeMenu,
  undo,
  redo
} from '../store/slices/spreadsheetSlice'

export function useSpreadsheet() {
  const dispatch = useAppDispatch()
  const cells = useAppSelector((s) => s.spreadsheet.cells)
  const display = useAppSelector((s) => s.spreadsheet.display)
  const colWidths = useAppSelector((s) => s.spreadsheet.colWidths)
  const selectedCol = useAppSelector((s) => s.spreadsheet.selectedCol)
  const selectedRow = useAppSelector((s) => s.spreadsheet.selectedRow)
  const rangeStart = useAppSelector((s) => s.spreadsheet.rangeStart)
  const rangeEnd = useAppSelector((s) => s.spreadsheet.rangeEnd)
  const isEditing = useAppSelector((s) => s.spreadsheet.isEditing)
  const editValue = useAppSelector((s) => s.spreadsheet.editValue)
  const scrollTop = useAppSelector((s) => s.spreadsheet.scrollTop)
  const menu = useAppSelector((s) => s.spreadsheet.menu)

  useEffect(() => {
    if (!cells.length) return
    const newDisplay: string[][] = []
    for (let i = 0; i < cells.length; i++) {
      const row: string[] = []
      for (let j = 0; j < cells[i].length; j++) {
        const val = cells[i][j]
        if (val?.startsWith('=')) {
          row.push(calculateFormula(val, cells))
        } else {
          row.push(val || '')
        }
      }
      newDisplay.push(row)
    }
    dispatch(setDisplay(newDisplay))
  }, [cells, dispatch])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditing) {
        return
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        dispatch(undo())
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        e.stopPropagation()
        dispatch(redo())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch, isEditing])

  const isInRange = (col: number, row: number) => {
    if (!rangeStart || !rangeEnd) return false
    const minCol = Math.min(rangeStart.col, rangeEnd.col)
    const maxCol = Math.max(rangeStart.col, rangeEnd.col)
    const minRow = Math.min(rangeStart.row, rangeEnd.row)
    const maxRow = Math.max(rangeStart.row, rangeEnd.row)
    return col >= minCol && col <= maxCol && row >= minRow && row <= maxRow
  }

  return {
    cells,
    display,
    colWidths,
    selectedCol,
    selectedRow,
    rangeStart,
    rangeEnd,
    isEditing,
    editValue,
    scrollTop,
    menu,
    isInRange,
    selectCell: (col: number, row: number, shift: boolean) =>
      dispatch(selectCell({ col, row, shift })),
    startEditing: () => dispatch(startEditing()),
    saveEdit: () => {
      dispatch(updateCell({ row: selectedRow, col: selectedCol, value: editValue }))
      dispatch(stopEditing())
    },
    setEditValue: (val: string) => dispatch(setEditText(val)),
    resizeColumn: (col: number, startX: number, startWidth: number) => {
      const onMove = (e: MouseEvent) =>
        dispatch(resizeColumn({ col, width: startWidth + (e.clientX - startX) }))
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMove), {
        once: true
      })
    },
    addRowBelow: (idx: number) => dispatch(addRowBelow(idx)),
    deleteRow: (idx: number) => dispatch(deleteRow(idx)),
    addColumnRight: (idx: number) => dispatch(addColumnRight(idx)),
    deleteColumn: (idx: number) => dispatch(deleteColumn(idx)),
    openRowMenu: (row: number, x: number, y: number) => dispatch(openMenu({ x, y, row })),
    openColMenu: (col: number, x: number, y: number) => dispatch(openMenu({ x, y, col })),
    closeMenu: () => dispatch(closeMenu()),
    handleKeyDown: (e: React.KeyboardEvent) => {
      if (isEditing && e.key === 'Enter') {
        dispatch(updateCell({ row: selectedRow, col: selectedCol, value: editValue }))
        dispatch(stopEditing())
      }
    },
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => dispatch(setScrollTop(e.currentTarget.scrollTop)),
    address: getCellAddress(selectedCol, selectedRow),
    currentValue: cells[selectedRow]?.[selectedCol] || ''
  }
}