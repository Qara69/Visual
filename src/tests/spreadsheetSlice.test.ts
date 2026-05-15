import { describe, test, expect } from 'vitest'
import spreadsheetReducer, {
  loadCells,
  updateCell,
  undo,
  redo
} from '../store/slices/spreadsheetSlice'

describe('spreadsheetSlice', () => {
  const initialState = {
    cells: [['1', '2'], ['3', '4']],
    display: [],
    colWidths: [100, 100],
    selectedCol: 0,
    selectedRow: 0,
    rangeStart: null,
    rangeEnd: null,
    isEditing: false,
    editValue: '',
    scrollTop: 0,
    menu: null,
    history: { past: [], future: [] }
  }

  test('loadCells - загружает ячейки', () => {
    const newCells = [['a', 'b'], ['c', 'd']]
    const newWidths = [80, 80]
    const next = spreadsheetReducer(initialState, loadCells({ cells: newCells, colWidths: newWidths }))
    expect(next.cells).toEqual(newCells)
    expect(next.colWidths).toEqual(newWidths)
  })

  test('updateCell - обновляет ячейку', () => {
    const next = spreadsheetReducer(initialState, updateCell({ row: 0, col: 0, value: '99' }))
    expect(next.cells[0][0]).toBe('99')
  })

  test('undo/redo - ctrl+z/ctrl+y', () => {
    let state = spreadsheetReducer(initialState, updateCell({ row: 0, col: 0, value: '99' }))
    state = spreadsheetReducer(state, undo())
    expect(state.cells[0][0]).toBe('1')
    state = spreadsheetReducer(state, redo())
    expect(state.cells[0][0]).toBe('99')
  })
})