import { useState, useEffect } from "react"
import { calculateFormula, getCellAddress } from "../tools/calculator"

export function useSpreadsheet(initialCells: string[][], initialWidths: number[]) {
  const [cells, setCells] = useState(initialCells)
  const [display, setDisplay] = useState(() => cells.map(row => row.map(() => "")))
  const [col, setCol] = useState(0)
  const [row, setRow] = useState(0)
  const [rangeStart, setRangeStart] = useState<any>(null)
  const [rangeEnd, setRangeEnd] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const [colWidths, setColWidths] = useState(initialWidths)
  const [scrollTop, setScrollTop] = useState(0)
  const [menu, setMenu] = useState<any>(null)

  useEffect(() => {
    const newDisplay = cells.map(row => 
      row.map(cell => cell.startsWith("=") ? calculateFormula(cell, cells) : cell)
    )
    setDisplay(newDisplay)
  }, [cells])

  function isInRange(c: number, r: number) {
    if (!rangeStart || !rangeEnd) return false
    const minCol = Math.min(rangeStart.col, rangeEnd.col)
    const maxCol = Math.max(rangeStart.col, rangeEnd.col)
    const minRow = Math.min(rangeStart.row, rangeEnd.row)
    const maxRow = Math.max(rangeStart.row, rangeEnd.row)
    return c >= minCol && c <= maxCol && r >= minRow && r <= maxRow
  }

  function selectCell(c: number, r: number, shift: boolean) {
    if (shift) {
      if (!rangeStart) setRangeStart({ col, row })
      setRangeEnd({ col: c, row: r })
    } else {
      setRangeStart(null)
      setRangeEnd(null)
    }
    setCol(c)
    setRow(r)
    setEditing(false)
  }

  function startEdit() {
    setEditing(true)
    setEditText(cells[row][col] || "")
  }

  function saveEdit() {
    const newCells = [...cells]
    newCells[row][col] = editText
    setCells(newCells)
    setEditing(false)
  }

  function resizeColumn(c: number, startX: number, startWidth: number) {
    const onMove = (e: MouseEvent) => {
      const newWidths = [...colWidths]
      newWidths[c] = startWidth + (e.clientX - startX)
      setColWidths(newWidths)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", () => window.removeEventListener("mousemove", onMove), { once: true })
  }

  function addRowAt(idx: number) {
    const newCells = [...cells]
    newCells.splice(idx + 1, 0, Array(cells[0].length).fill(""))
    setCells(newCells)
    setMenu(null)
  }

  function deleteRowAt(idx: number) {
    if (cells.length > 1) setCells(cells.filter((_, i) => i !== idx))
    setMenu(null)
  }

  function addColAt(idx: number) {
    setCells(cells.map(r => { const nr = [...r]; nr.splice(idx + 1, 0, ""); return nr }))
    setColWidths([...colWidths.slice(0, idx + 1), 100, ...colWidths.slice(idx + 1)])
    setMenu(null)
  }

  function deleteColAt(idx: number) {
    if (cells[0].length > 1) {
      setCells(cells.map(r => r.filter((_, i) => i !== idx)))
      setColWidths(colWidths.filter((_, i) => i !== idx))
    }
    setMenu(null)
  }

  return {
    cells, display, colWidths, selectedCol: col, selectedRow: row,
    rangeStart, rangeEnd, editing, editText, scrollTop, menu,
    isInRange, selectCell, startEdit, saveEdit, changeEditText: setEditText,
    resizeColumn, addRowAt, deleteRowAt, addColAt, deleteColAt,
    openRowMenu: (r: number, x: number, y: number) => setMenu({ x, y, row: r }),
    openColMenu: (c: number, x: number, y: number) => setMenu({ x, y, col: c }),
    closeMenu: () => setMenu(null),
    handleKeyDown: (e: any) => editing && e.key === "Enter" && saveEdit(),
    handleScroll: (e: any) => setScrollTop(e.currentTarget.scrollTop),
    address: getCellAddress(col, row),
    currentValue: cells[row]?.[col] || "",
  }
}