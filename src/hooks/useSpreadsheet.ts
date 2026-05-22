import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { calculateFormula, getCellAddress } from '@/tools/calculator'
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
  setRangeStart,
  setRangeEnd,
  setScrollTop,
  openMenu,
  closeMenu,
  undo,
  redo,
  updateCellStyle
} from '@/store/slices/spreadsheetSlice'
import type { CellStyle } from '@/store/slices/spreadsheetSlice'

export function useSpreadsheet() {
  const dispatch = useAppDispatch()
  
  const cells = useAppSelector((state) => state.spreadsheet.cells)
  const display = useAppSelector((state) => state.spreadsheet.display)
  const colWidths = useAppSelector((state) => state.spreadsheet.colWidths)
  const selectedCol = useAppSelector((state) => state.spreadsheet.selectedCol)
  const selectedRow = useAppSelector((state) => state.spreadsheet.selectedRow)
  const rangeStart = useAppSelector((state) => state.spreadsheet.rangeStart)
  const rangeEnd = useAppSelector((state) => state.spreadsheet.rangeEnd)
  const isEditing = useAppSelector((state) => state.spreadsheet.isEditing)
  const editValue = useAppSelector((state) => state.spreadsheet.editValue)
  const scrollTop = useAppSelector((state) => state.spreadsheet.scrollTop)
  const menu = useAppSelector((state) => state.spreadsheet.menu)
  const cellStyles = useAppSelector((state) => state.spreadsheet.cellStyles)

  useEffect(() => {
    if (cells.length === 0) return
    
    const newDisplay: string[][] = []
    for (let i = 0; i < cells.length; i++) {
      const row: string[] = []
      for (let j = 0; j < cells[i].length; j++) {
        const value = cells[i][j]
        if (value?.startsWith('=')) {
          row.push(calculateFormula(value, cells))
        } else {
          row.push(value || '')
        }
      }
      newDisplay.push(row)
    }
    dispatch(setDisplay(newDisplay))
  }, [cells, dispatch])

  const getCurrentStyle = useCallback((): CellStyle => {
    return cellStyles[selectedRow]?.[selectedCol] || {
      bold: false,
      italic: false,
      underline: false,
      bgColor: '#ffffff',
      textColor: '#000000',
      align: 'left',
      format: 'text'
    }
  }, [cellStyles, selectedRow, selectedCol])

  const copyRange = useCallback((): string => {
    if (!rangeStart || !rangeEnd) {
      const value = cells[selectedRow]?.[selectedCol] || ''
      const style = cellStyles[selectedRow]?.[selectedCol] || {}
      return JSON.stringify({ value, style })
    }
    
    const minRow = Math.min(rangeStart.row, rangeEnd.row)
    const maxRow = Math.max(rangeStart.row, rangeEnd.row)
    const minCol = Math.min(rangeStart.col, rangeEnd.col)
    const maxCol = Math.max(rangeStart.col, rangeEnd.col)
    
    const rows = []
    for (let row = minRow; row <= maxRow; row++) {
      const rowData = []
      for (let col = minCol; col <= maxCol; col++) {
        rowData.push({
          value: cells[row]?.[col] || '',
          style: cellStyles[row]?.[col] || {}
        })
      }
      rows.push(rowData)
    }
    return JSON.stringify(rows)
  }, [rangeStart, rangeEnd, cells, cellStyles, selectedRow, selectedCol])

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      const data = JSON.parse(text)
      
      if (Array.isArray(data)) {
        for (let row = 0; row < data.length; row++) {
          for (let col = 0; col < data[row].length; col++) {
            const targetRow = selectedRow + row
            const targetCol = selectedCol + col
            if (targetRow < cells.length && targetCol < cells[0].length) {
              dispatch(updateCell({ row: targetRow, col: targetCol, value: data[row][col].value }))
              if (data[row][col].style) {
                const style = data[row][col].style
                if (style.bold !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'bold', value: style.bold }))
                if (style.italic !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'italic', value: style.italic }))
                if (style.underline !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'underline', value: style.underline }))
                if (style.align !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'align', value: style.align }))
                if (style.format !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'format', value: style.format }))
                if (style.bgColor !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'bgColor', value: style.bgColor }))
                if (style.textColor !== undefined) dispatch(updateCellStyle({ row: targetRow, col: targetCol, style: 'textColor', value: style.textColor }))
              }
            }
          }
        }
      } else if (data.value !== undefined) {
        dispatch(updateCell({ row: selectedRow, col: selectedCol, value: data.value }))
        if (data.style) {
          const style = data.style
          if (style.bold !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'bold', value: style.bold }))
          if (style.italic !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'italic', value: style.italic }))
          if (style.underline !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'underline', value: style.underline }))
          if (style.align !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'align', value: style.align }))
          if (style.format !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'format', value: style.format }))
          if (style.bgColor !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'bgColor', value: style.bgColor }))
          if (style.textColor !== undefined) dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'textColor', value: style.textColor }))
        }
      }
    } catch {
      const text = await navigator.clipboard.readText()
      dispatch(updateCell({ row: selectedRow, col: selectedCol, value: text }))
    }
  }, [selectedRow, selectedCol, cells, dispatch])

const clearSelectedCells = useCallback(() => {
  const defaultStyle = {
    bold: false,
    italic: false,
    underline: false,
    bgColor: '#ffffff',
    textColor: '#000000',
    align: 'left' as const,
    format: 'text' as const
  }
  
  if (!rangeStart || !rangeEnd) {
    dispatch(updateCell({ row: selectedRow, col: selectedCol, value: '' }))
    Object.keys(defaultStyle).forEach((style) => {
      dispatch(updateCellStyle({ 
        row: selectedRow, 
        col: selectedCol, 
        style: style as keyof CellStyle, 
        value: defaultStyle[style as keyof CellStyle] 
      }))
    })
    return
  }
  
  const minRow = Math.min(rangeStart.row, rangeEnd.row)
  const maxRow = Math.max(rangeStart.row, rangeEnd.row)
  const minCol = Math.min(rangeStart.col, rangeEnd.col)
  const maxCol = Math.max(rangeStart.col, rangeEnd.col)
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      dispatch(updateCell({ row, col, value: '' }))
      Object.keys(defaultStyle).forEach((style) => {
        dispatch(updateCellStyle({ 
          row, 
          col, 
          style: style as keyof CellStyle, 
          value: defaultStyle[style as keyof CellStyle] 
        }))
      })
    }
  }
}, [rangeStart, rangeEnd, selectedRow, selectedCol, dispatch])

  const selectAll = useCallback(() => {
    if (cells.length === 0) return
    dispatch(selectCell({ col: 0, row: 0, shift: false }))
    dispatch(setRangeStart({ col: 0, row: 0 }))
    dispatch(setRangeEnd({ col: cells[0].length - 1, row: cells.length - 1 }))
  }, [cells, dispatch])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      
      if (isEditing) {
        if (event.key === 'Enter') {
          event.preventDefault()
          dispatch(updateCell({ row: selectedRow, col: selectedCol, value: editValue }))
          dispatch(stopEditing())
        }
        if (event.key === 'Escape') {
          event.preventDefault()
          dispatch(stopEditing())
        }
        return
      }
      
      const isCtrl = event.ctrlKey || event.metaKey
      
      // Ctrl+Z
      if (isCtrl && event.key === 'z') {
        event.preventDefault()
        dispatch(undo())
        return
      }
      
      // Ctrl+Y
      if (isCtrl && event.key === 'y') {
        event.preventDefault()
        dispatch(redo())
        return
      }
      
      // Ctrl+B
      if (isCtrl && event.key === 'b') {
        event.preventDefault()
        const style = getCurrentStyle()
        dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'bold', value: !style.bold }))
        return
      }
      
      // Ctrl+I
      if (isCtrl && event.key === 'i') {
        event.preventDefault()
        const style = getCurrentStyle()
        dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'italic', value: !style.italic }))
        return
      }
      
      // Ctrl+U
      if (isCtrl && event.key === 'u') {
        event.preventDefault()
        const style = getCurrentStyle()
        dispatch(updateCellStyle({ row: selectedRow, col: selectedCol, style: 'underline', value: !style.underline }))
        return
      }
      
      // Ctrl+C
      if (isCtrl && event.key === 'c') {
        event.preventDefault()
        const data = copyRange()
        navigator.clipboard.writeText(data)
        return
      }
      
      // Ctrl+X
      if (isCtrl && event.key === 'x') {
        event.preventDefault()
        const data = copyRange()
        navigator.clipboard.writeText(data)
        clearSelectedCells()
        return
      }
      
      // Ctrl+V
      if (isCtrl && event.key === 'v') {
        event.preventDefault()
        pasteFromClipboard()
        return
      }
      
      // Backspace
      if (event.key === 'Backspace') {
        event.preventDefault()
        clearSelectedCells()
        return
      }
    }
    
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    dispatch, isEditing, selectedRow, selectedCol, editValue, colWidths,
    getCurrentStyle, copyRange, clearSelectedCells, pasteFromClipboard, selectAll
  ])

  const isInRange = useCallback((col: number, row: number): boolean => {
    if (!rangeStart || !rangeEnd) return false
    const minCol = Math.min(rangeStart.col, rangeEnd.col)
    const maxCol = Math.max(rangeStart.col, rangeEnd.col)
    const minRow = Math.min(rangeStart.row, rangeEnd.row)
    const maxRow = Math.max(rangeStart.row, rangeEnd.row)
    return col >= minCol && col <= maxCol && row >= minRow && row <= maxRow
  }, [rangeStart, rangeEnd])

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
    cellStyles,
    isInRange,
    selectCell: (col: number, row: number, shift: boolean) => dispatch(selectCell({ col, row, shift })),
    startEditing: () => dispatch(startEditing()),
    saveEdit: () => {
      dispatch(updateCell({ row: selectedRow, col: selectedCol, value: editValue }))
      dispatch(stopEditing())
    },
    setEditValue: (value: string) => dispatch(setEditText(value)),
    resizeColumn: (col: number, startX: number, startWidth: number) => {
      const onMove = (event: MouseEvent) => {
        dispatch(resizeColumn({ col, width: startWidth + (event.clientX - startX) }))
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMove), { once: true })
    },
    addRowBelow: (index: number) => dispatch(addRowBelow(index)),
    deleteRow: (index: number) => dispatch(deleteRow(index)),
    addColumnRight: (index: number) => dispatch(addColumnRight(index)),
    deleteColumn: (index: number) => dispatch(deleteColumn(index)),
    openRowMenu: (row: number, x: number, y: number) => dispatch(openMenu({ x, y, row })),
    openColMenu: (col: number, x: number, y: number) => dispatch(openMenu({ x, y, col })),
    closeMenu: () => dispatch(closeMenu()),
    handleKeyDown: (event: React.KeyboardEvent) => {
      if (isEditing && event.key === 'Enter') {
        dispatch(updateCell({ row: selectedRow, col: selectedCol, value: editValue }))
        dispatch(stopEditing())
      }
    },
    handleScroll: (event: React.UIEvent<HTMLDivElement>) => dispatch(setScrollTop(event.currentTarget.scrollTop)),
    address: getCellAddress(selectedCol, selectedRow),
    currentValue: cells[selectedRow]?.[selectedCol] || ''
  }
}