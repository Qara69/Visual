import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Document {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  cells: string[][]
  colWidths: number[]
  rows: number
  cols: number
}

export interface DocumentsState {
  list: Document[]
  activeDoc: Document | null
  loading: boolean
  error: string | null
}

const STORAGE_KEY = "spreadsheet_docs"

const initialState: DocumentsState = {
  list: [],
  activeDoc: null,
  loading: false,
  error: null
}

export const fetchDocuments = createAsyncThunk('documents/fetch', async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
})

export const saveDocument = createAsyncThunk(
  'documents/save',
  async ({ id, updates }: { id: string; updates: Partial<Document> }) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    let docs = saved ? JSON.parse(saved) : []
    docs = docs.map((doc: Document) =>
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
    return { id, updates, docs }
  }
)

export const createDocument = createAsyncThunk(
  'documents/create',
  async ({ name, rows, cols }: { name: string; rows: number; cols: number }) => {
    const cells = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) row.push("")
      cells.push(row)
    }
    const newDoc: Document = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cells,
      colWidths: Array(cols).fill(100),
      rows,
      cols
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    const docs = saved ? JSON.parse(saved) : []
    docs.push(newDoc)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
    return newDoc
  }
)

export const deleteDocument = createAsyncThunk('documents/delete', async (id: string) => {
  const saved = localStorage.getItem(STORAGE_KEY)
  let docs = saved ? JSON.parse(saved) : []
  docs = docs.filter((doc: Document) => doc.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  return id
})

export const duplicateDocument = createAsyncThunk('documents/duplicate', async (id: string) => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const docs = saved ? JSON.parse(saved) : []
  const original = docs.find((doc: Document) => doc.id === id)
  if (original) {
    const newDoc: Document = {
      ...original,
      id: Date.now().toString(),
      name: original.name + " (копия)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    docs.push(newDoc)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
    return newDoc
  }
  return null
})

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setActiveDocument: (state, action: PayloadAction<Document | null>) => {
      state.activeDoc = action.payload
    },
    renameDocument: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const doc = state.list.find(d => d.id === action.payload.id)
      if (doc) doc.name = action.payload.newName
      if (state.activeDoc?.id === action.payload.id) state.activeDoc.name = action.payload.newName
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.list))
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
      .addCase(fetchDocuments.rejected, (state) => {
        state.loading = false
        state.error = 'Ошибка загрузки'
      })
      .addCase(saveDocument.fulfilled, (state, action) => {
        state.list = action.payload.docs
        if (state.activeDoc?.id === action.payload.id) {
          state.activeDoc = { ...state.activeDoc, ...action.payload.updates }
        }
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.list = state.list.filter(d => d.id !== action.payload)
        if (state.activeDoc?.id === action.payload) state.activeDoc = null
      })
      .addCase(duplicateDocument.fulfilled, (state, action) => {
        if (action.payload) state.list.push(action.payload)
      })
  }
})

export const { setActiveDocument, renameDocument } = documentsSlice.actions
export default documentsSlice.reducer