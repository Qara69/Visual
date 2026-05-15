import { describe, test, expect } from 'vitest'
import documentsReducer, {
  setActiveDocument,
  renameDocument
} from '../store/slices/documentsSlice'

describe('documentsSlice', () => {
  const emptyDoc = {
    id: '1',
    name: 'Test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cells: [],
    colWidths: [],
    rows: 10,
    cols: 10
  }

  test('setActiveDocument - устанавливает активный документ', () => {
    const state = { list: [], activeDoc: null, loading: false, error: null }
    const next = documentsReducer(state, setActiveDocument(emptyDoc))
    expect(next.activeDoc).toEqual(emptyDoc)
  })

  test('renameDocument - переименовывает документ', () => {
    const state = { list: [{ ...emptyDoc, name: 'Old' }], activeDoc: null, loading: false, error: null }
    const next = documentsReducer(state, renameDocument({ id: '1', newName: 'New' }))
    expect(next.list[0].name).toBe('New')
  })

  test('setActiveDocument(null) - очищает активный документ', () => {
    const state = { list: [], activeDoc: emptyDoc, loading: false, error: null }
    const next = documentsReducer(state, setActiveDocument(null))
    expect(next.activeDoc).toBeNull()
  })
})