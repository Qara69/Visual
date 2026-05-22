import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CellStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  bgColor: string
  textColor: string
  align: 'left' | 'center' | 'right'
  format: 'text' | 'number' | 'percent' | 'currency' | 'date'
}

export interface SpreadsheetState {
  cells: string[][]
  display: string[][]
  colWidths: number[]
  selectedCol: number
  selectedRow: number
  rangeStart: { col: number; row: number } | null
  rangeEnd: { col: number; row: number } | null
  isEditing: boolean
  editValue: string
  scrollTop: number
  menu: { x: number; y: number; row?: number; col?: number } | null
  history: { past: string[][][]; future: string[][][] }
  cellStyles: CellStyle[][]
}

const defaultStyle: CellStyle = {
  bold: false,
  italic: false,
  underline: false,
  bgColor: '#ffffff',
  textColor: '#000000',
  align: 'left',
  format: 'text'
}

const initialState: SpreadsheetState = {
  cells: [],
  display: [],
  colWidths: [],
  selectedCol: 0,
  selectedRow: 0,
  rangeStart: null,
  rangeEnd: null,
  isEditing: false,
  editValue: '',
  scrollTop: 0,
  menu: null,
  history: { past: [], future: [] },
  cellStyles: []
}

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    loadCells(state, action: PayloadAction<{ cells: string[][]; colWidths: number[]; cellStyles?: CellStyle[][] }>) {
      state.cells = action.payload.cells
      state.colWidths = action.payload.colWidths
      state.cellStyles = action.payload.cellStyles || []
      state.history = { past: [], future: [] }
    },
    setDisplay(state, action: PayloadAction<string[][]>) {
      state.display = action.payload
    },
    updateCell(state, action: PayloadAction<{ row: number; col: number; value: string }>) {
      const { row, col, value } = action.payload
      const copy = state.cells.map(r => [...r])
      state.history.past.push(copy)
      state.history.future = []
      state.cells[row][col] = value
    },
    updateCellStyle(state, action: PayloadAction<{ row: number; col: number; style: keyof CellStyle; value: string | boolean }>) {
      const { row, col, style, value } = action.payload
      if (!state.cellStyles[row]) {
        state.cellStyles[row] = []
      }
      if (!state.cellStyles[row][col]) {
        state.cellStyles[row][col] = { ...defaultStyle }
      }
      state.cellStyles[row][col] = {
        ...state.cellStyles[row][col],
        [style]: value
      }
    },
    undo(state) {
      if (state.history.past.length === 0) return
      const prev = state.history.past.pop()!
      state.history.future.push(state.cells.map(r => [...r]))
      state.cells = prev
    },
    redo(state) {
      if (state.history.future.length === 0) return
      const next = state.history.future.pop()!
      state.history.past.push(state.cells.map(r => [...r]))
      state.cells = next
    },
    selectCell(state, action: PayloadAction<{ col: number; row: number; shift: boolean }>) {
      const { col, row, shift } = action.payload
      if (shift) {
        if (state.rangeStart === null) {
          state.rangeStart = { col: state.selectedCol, row: state.selectedRow }
        }
        state.rangeEnd = { col, row }
      } else {
        state.rangeStart = null
        state.rangeEnd = null
      }
      state.selectedCol = col
      state.selectedRow = row
      state.isEditing = false
    },
    startEditing(state) {
      state.isEditing = true
      state.editValue = state.cells[state.selectedRow]?.[state.selectedCol] || ''
    },
    setEditText(state, action: PayloadAction<string>) {
      state.editValue = action.payload
    },
    resizeColumn(state, action: PayloadAction<{ col: number; width: number }>) {
      state.colWidths[action.payload.col] = action.payload.width
    },
    addRowBelow(state, action: PayloadAction<number>) {
      const empty = Array(state.cells[0]?.length || 26).fill('')
      state.cells.splice(action.payload + 1, 0, empty)
      const emptyStyleRow = Array(state.cells[0]?.length || 26).fill({ ...defaultStyle })
      if (state.cellStyles.length) {
        state.cellStyles.splice(action.payload + 1, 0, emptyStyleRow)
      }
    },
    deleteRow(state, action: PayloadAction<number>) {
      if (state.cells.length > 1) {
        state.cells.splice(action.payload, 1)
        if (state.cellStyles.length) {
          state.cellStyles.splice(action.payload, 1)
        }
      }
    },
    addColumnRight(state, action: PayloadAction<number>) {
      for (let i = 0; i < state.cells.length; i++) {
        state.cells[i].splice(action.payload + 1, 0, '')
      }
      state.colWidths.splice(action.payload + 1, 0, 100)
      for (let i = 0; i < state.cellStyles.length; i++) {
        if (state.cellStyles[i]) {
          state.cellStyles[i].splice(action.payload + 1, 0, { ...defaultStyle })
        }
      }
    },
    deleteColumn(state, action: PayloadAction<number>) {
      if (state.cells[0]?.length > 1) {
        for (let i = 0; i < state.cells.length; i++) {
          state.cells[i].splice(action.payload, 1)
        }
        state.colWidths.splice(action.payload, 1)
        for (let i = 0; i < state.cellStyles.length; i++) {
          if (state.cellStyles[i]) {
            state.cellStyles[i].splice(action.payload, 1)
          }
        }
      }
    },
    setRangeStart(state, action: PayloadAction<{ col: number; row: number } | null>) {
      state.rangeStart = action.payload
    },
    setRangeEnd(state, action: PayloadAction<{ col: number; row: number } | null>) {
      state.rangeEnd = action.payload
    },
    setScrollTop(state, action: PayloadAction<number>) {
      state.scrollTop = action.payload
    },
    openMenu(state, action: PayloadAction<{ x: number; y: number; row?: number; col?: number }>) {
      state.menu = action.payload
    },
    stopEditing(state) {
      state.isEditing = false
      state.editValue = ''
    },
    closeMenu(state) {
      state.menu = null
    }
  }
})

export const {
  loadCells,
  setDisplay,
  updateCell,
  updateCellStyle,
  undo,
  redo,
  selectCell,
  startEditing,
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
  stopEditing
} = spreadsheetSlice.actions

export default spreadsheetSlice.reducer