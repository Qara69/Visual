import { useState, useEffect } from "react"
import { calculateFormula, getCellAddress } from "../tools/calculator"

const COLS = 26
const ROWS = 1000

function createEmptyTable(rows: number, cols: number): string[][] {
  const arr = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      row.push("")
    }
    arr.push(row)
  }
  return arr
}

export function useSpreadsheet() {
  const [cells, setCells] = useState(() => createEmptyTable(ROWS, COLS))
  const [display, setDisplay] = useState(() => createEmptyTable(ROWS, COLS))
  const [selectedCol, setSelectedCol] = useState(0)
  const [selectedRow, setSelectedRow] = useState(0)
  const [rangeStart, setRangeStart] = useState<{ col: number; row: number } | null>(null)
  const [rangeEnd, setRangeEnd] = useState<{ col: number; row: number } | null>(null)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const [colWidths, setColWidths] = useState(() => Array(COLS).fill(100))
  const [scrollTop, setScrollTop] = useState(0)
  const [menu, setMenu] = useState<{ x: number; y: number; row?: number; col?: number } | null>(null)

  // Пересчет формул
  useEffect(() => {
    const newDisplay = []
    for (let r = 0; r < cells.length; r++) {
      const row = []
      for (let c = 0; c < cells[r].length; c++) {
        const val = cells[r][c]
        row.push(val.startsWith("=") ? calculateFormula(val, cells) : val)
      }
      newDisplay.push(row)
    }
    setDisplay(newDisplay)
  }, [cells])

  const address = getCellAddress(selectedCol, selectedRow)
  const currentValue = cells[selectedRow][selectedCol]

  function isInRange(col: number, row: number): boolean {
    if (!rangeStart || !rangeEnd) return false
    const minCol = Math.min(rangeStart.col, rangeEnd.col)
    const maxCol = Math.max(rangeStart.col, rangeEnd.col)
    const minRow = Math.min(rangeStart.row, rangeEnd.row)
    const maxRow = Math.max(rangeStart.row, rangeEnd.row)
    return col >= minCol && col <= maxCol && row >= minRow && row <= maxRow
  }

  function selectCell(col: number, row: number, shift: boolean) {
    if (shift) {
      if (rangeStart === null) setRangeStart({ col: selectedCol, row: selectedRow })
      setRangeEnd({ col, row })
    } else {
      setRangeStart(null)
      setRangeEnd(null)
    }
    setSelectedCol(col)
    setSelectedRow(row)
    setEditing(false)
  }

  function startEdit() {
    setEditing(true)
    setEditText(cells[selectedRow][selectedCol])
  }

  function saveEdit() {
    const newCells = [...cells]
    newCells[selectedRow][selectedCol] = editText
    setCells(newCells)
    setEditing(false)
  }

  function resizeColumn(col: number, startX: number, startWidth: number) {
    const onMove = (e: MouseEvent) => {
      const newWidths = [...colWidths]
      newWidths[col] = startWidth + (e.clientX - startX)
      setColWidths(newWidths)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", () => window.removeEventListener("mousemove", onMove), { once: true })
  }

  function addRowAt(index: number) {
    const newCells = [...cells]
    newCells.splice(index + 1, 0, Array(COLS).fill(""))
    setCells(newCells)
    setMenu(null)
  }

  function deleteRowAt(index: number) {
    if (cells.length > 1) setCells(cells.filter((_, i) => i !== index))
    setMenu(null)
  }

  function addColAt(index: number) {
    setCells(cells.map(row => {
      const newRow = [...row]
      newRow.splice(index + 1, 0, "")
      return newRow
    }))
    setColWidths([...colWidths.slice(0, index + 1), 100, ...colWidths.slice(index + 1)])
    setMenu(null)
  }

  function deleteColAt(index: number) {
    if (cells[0].length > 1) {
      setCells(cells.map(row => row.filter((_, i) => i !== index)))
      setColWidths(colWidths.filter((_, i) => i !== index))
    }
    setMenu(null)
  }

  return {
    cells, display, colWidths, selectedCol, selectedRow,
    rangeStart, rangeEnd, editing, editText, scrollTop,
    address, currentValue, menu,
    isInRange, selectCell, startEdit, saveEdit,
    changeEditText: setEditText,
    resizeColumn, addRowAt, deleteRowAt, addColAt, deleteColAt,
    openRowMenu: (row: number, x: number, y: number) => setMenu({ x, y, row }),
    openColMenu: (col: number, x: number, y: number) => setMenu({ x, y, col }),
    closeMenu: () => setMenu(null),
    handleKeyDown: (e: React.KeyboardEvent) => editing && e.key === "Enter" && saveEdit(),
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop),
  }
}