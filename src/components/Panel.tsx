import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateCellStyle } from '@/store/slices/spreadsheetSlice'
import type { CellStyle } from '@/store/slices/spreadsheetSlice'

interface PanelProps {
  address: string
  value: string
}

export function Panel({ address, value }: PanelProps) {
  const dispatch = useAppDispatch()
  const col = useAppSelector((s) => s.spreadsheet.selectedCol)
  const row = useAppSelector((s) => s.spreadsheet.selectedRow)
  const styles = useAppSelector((s) => s.spreadsheet.cellStyles)

  const style: CellStyle = styles[row]?.[col] || {
    bold: false,
    italic: false,
    underline: false,
    bgColor: '#ffffff',
    textColor: '#000000',
    align: 'left',
    format: 'text'
  }

  const updateBold = () => {
    dispatch(updateCellStyle({ row, col, style: 'bold', value: !style.bold }))
  }
  const updateItalic = () => {
    dispatch(updateCellStyle({ row, col, style: 'italic', value: !style.italic }))
  }
  const updateUnderline = () => {
    dispatch(updateCellStyle({ row, col, style: 'underline', value: !style.underline }))
  }
  const updateAlign = (val: string) => {
    dispatch(updateCellStyle({ row, col, style: 'align', value: val as 'left' | 'center' | 'right' }))
  }
  const updateBgColor = (val: string) => {
    dispatch(updateCellStyle({ row, col, style: 'bgColor', value: val }))
  }
  const updateTextColor = (val: string) => {
    dispatch(updateCellStyle({ row, col, style: 'textColor', value: val }))
  }
  const updateFormat = (val: string) => {
    dispatch(updateCellStyle({ row, col, style: 'format', value: val as 'text' | 'number' | 'percent' | 'currency' | 'date' }))
  }

  let displayValue = value
  const num = parseFloat(value)
  if (!isNaN(num)) {
    if (style.format === 'percent') displayValue = (num * 100).toFixed(0) + '%'
    if (style.format === 'currency') displayValue = '₽ ' + num.toFixed(2)
    if (style.format === 'date') displayValue = new Date(num).toLocaleDateString()
    if (style.format === 'number') displayValue = num.toString()
  }

  return (
    <div className="panel">
      <div className="panel-row">
        <div className="address">{address}</div>
        <div className="cellValue">{displayValue}</div>
      </div>
      
      <div className="format-toolbar">
        <button className={style.bold ? 'active' : ''} onClick={updateBold}><b>B</b></button>
        <button className={style.italic ? 'active' : ''} onClick={updateItalic}><i>I</i></button>
        <button className={style.underline ? 'active' : ''} onClick={updateUnderline}><u>U</u></button>
        
        <select value={style.align} onChange={(e) => updateAlign(e.target.value)}>
          <option value="left">L</option>
          <option value="center">C</option>
          <option value="right">R</option>
        </select>
        
        <input type="color" value={style.bgColor} onChange={(e) => updateBgColor(e.target.value)} />
        <input type="color" value={style.textColor} onChange={(e) => updateTextColor(e.target.value)} />
        
        <select value={style.format} onChange={(e) => updateFormat(e.target.value)}>
          <option value="text">Текст</option>
          <option value="number">123</option>
          <option value="percent">%</option>
          <option value="currency">₽</option>
        </select>
      </div>
    </div>
  )
}