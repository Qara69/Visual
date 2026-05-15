import { describe, test, expect } from 'vitest'
import uiReducer, {
  setSaveStatus,
  openModal,
  closeModal
} from '../store/slices/uiSlice'

describe('uiSlice', () => {
  const initialState = {
    saveStatus: 'saved' as const,
    showModal: false,
    modalData: null,
    notification: null
  }

  test('setSaveStatus - меняет статус сохранения', () => {
    const next = uiReducer(initialState, setSaveStatus('saving'))
    expect(next.saveStatus).toBe('saving')
  })

  test('openModal - открывает модальное окно', () => {
    const modalData = { name: '', rows: 50, cols: 26 }
    const next = uiReducer(initialState, openModal(modalData))
    expect(next.showModal).toBe(true)
    expect(next.modalData).toEqual(modalData)
  })

  test('closeModal - закрывает модальное окно', () => {
    let state = uiReducer(initialState, openModal({ name: '', rows: 50, cols: 26 }))
    state = uiReducer(state, closeModal())
    expect(state.showModal).toBe(false)
    expect(state.modalData).toBeNull()
  })
})