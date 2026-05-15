import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  saveStatus: 'saved' | 'saving' | 'error'
  showModal: boolean
  modalData: { name: string; rows: number; cols: number } | null
  notification: { message: string; type: 'success' | 'error' } | null
}

const initialState: UiState = {
  saveStatus: 'saved',
  showModal: false,
  modalData: null,
  notification: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSaveStatus: (state, action: PayloadAction<'saved' | 'saving' | 'error'>) => {
      state.saveStatus = action.payload
    },
    openModal: (state, action: PayloadAction<{ name: string; rows: number; cols: number }>) => {
      state.showModal = true
      state.modalData = action.payload
    },
    closeModal: (state) => {
      state.showModal = false
      state.modalData = null
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    }
  }
})

export const { setSaveStatus, openModal, closeModal, showNotification, clearNotification } = uiSlice.actions
export default uiSlice.reducer