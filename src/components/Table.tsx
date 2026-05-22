import { useEffect, useRef, memo } from 'react'
import type { CellStyle } from '@/store/slices/spreadsheetSlice'

const ROW_HEIGHT = 28
const BUFFER = 5

function colLetter(n: number): string {
  if (n < 26) return String.fromCharCode(65 + n)
  return String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26))
}

interface TableRowProps {
  rowIndex: number
  row: string[]
  displayRow: string[]
  selectedCol: number
  selectedRow: number
  isEditing: boolean
  editValue: string
  cellStyles: CellStyle[][]
  isInRange: (col: number, row: number) => boolean
  selectCell: (col: number, row: number, shift: boolean) => void
  startEditing: () => void
  saveEdit: () => void
  setEditValue: (value: string) => void
  openRowMenu: (row: number, x: number, y: number) => void
}

interface TableProps {
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
  containerHeight: number
  menu: { x: number; y: number; row?: number; col?: number } | null
  cellStyles: CellStyle[][]
  isInRange: (col: number, row: number) => boolean
  selectCell: (col: number, row: number, shift: boolean) => void
  startEditing: () => void
  saveEdit: () => void
  setEditValue: (value: string) => void
  resizeColumn: (col: number, startX: number, startWidth: number) => void
  addRowBelow: (index: number) => void
  deleteRow: (index: number) => void
  addColumnRight: (index: number) => void
  deleteColumn: (index: number) => void
  openRowMenu: (row: number, x: number, y: number) => void
  openColMenu: (col: number, x: number, y: number) => void
  closeMenu: () => void
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void
}

const TableRow = memo(({ 
  rowIndex, row, displayRow, selectedCol, selectedRow, isEditing, editValue,
  cellStyles, isInRange, selectCell, startEditing, saveEdit, setEditValue, openRowMenu
}: TableRowProps) => {
  return (
    <tr key={rowIndex}>
      <td
        style={{ background: '#f5f5f5', textAlign: 'center', width: 50, border: '1px solid #ccc' }}
        onContextMenu={(event) => {
          event.preventDefault()
          openRowMenu(rowIndex, event.clientX, event.clientY)
        }}
      >
        {rowIndex + 1}
      </td>
      {row.map((_: string, colIndex: number) => {
        const isSelected = colIndex === selectedCol && rowIndex === selectedRow
        const inRange = isInRange(colIndex, rowIndex)
        const style = cellStyles[rowIndex]?.[colIndex] || {} as CellStyle
        let cellValue = displayRow?.[colIndex] || ''
        
        if (style.format && style.format !== 'text') {
          const num = parseFloat(cellValue)
          if (!isNaN(num)) {
            switch (style.format) {
              case 'percent': cellValue = `${(num * 100).toFixed(0)}%`; break
              case 'currency': cellValue = `₽ ${num.toFixed(2)}`; break
              case 'date': cellValue = new Date(num).toLocaleDateString(); break
              default: cellValue = num.toString()
            }
          }
        }
        
        return (
          <td
            key={colIndex}
            className={`cell ${isSelected ? 'selected' : ''} ${inRange ? 'range' : ''}`}
            onClick={(event) => selectCell(colIndex, rowIndex, event.shiftKey)}
            onDoubleClick={startEditing}
            style={{
              border: '1px solid #ccc',
              padding: 0,
              height: 28,
              backgroundColor: style.bgColor || '#ffffff',
              color: style.textColor || '#000000',
              fontWeight: style.bold ? 'bold' : 'normal',
              fontStyle: style.italic ? 'italic' : 'normal',
              textDecoration: style.underline ? 'underline' : 'none',
              textAlign: style.align || 'left'
            }}
          >
            {isSelected && isEditing ? (
              <input
                className="cell-input"
                value={editValue}
                onChange={(event) => setEditValue(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && saveEdit()}
                onBlur={saveEdit}
                autoFocus
              />
            ) : (
              <div style={{ padding: '0 5px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{cellValue}</div>
            )}
          </td>
        )
      })}
    </tr>
  )
})

export function Table(props: TableProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        props.closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [props.closeMenu])

  if (props.cells.length === 0) {
    return <div style={{ padding: 20 }}>Загрузка таблицы...</div>
  }

  const startIndex = Math.max(0, Math.floor(props.scrollTop / ROW_HEIGHT) - BUFFER)
  const endIndex = Math.min(props.cells.length, Math.ceil((props.scrollTop + props.containerHeight) / ROW_HEIGHT) + BUFFER)
  
  const visibleRows: number[] = []
  for (let i = startIndex; i < endIndex; i++) {
    visibleRows.push(i)
  }

  const totalHeight = props.cells.length * ROW_HEIGHT
  const offsetY = startIndex * ROW_HEIGHT

  return (
    <div className="table-container" tabIndex={0} onKeyDown={props.handleKeyDown} onScroll={props.handleScroll}>
      <div className="table-virtual" style={{ height: totalHeight }}>
        <div className="table-viewport" style={{ transform: `translateY(${offsetY}px)` }}>
          <table className="spreadsheet">
            <thead>
              <tr>
                <th style={{ width: 50, background: '#f5f5f5', position: 'sticky', top: 0, border: '1px solid #ccc' }}></th>
                {props.colWidths.map((width, col) => (
                  <th
                    key={col}
                    style={{ width, background: '#f5f5f5', position: 'sticky', top: 0, border: '1px solid #ccc' }}
                    onContextMenu={(event) => {
                      event.preventDefault()
                      props.openColMenu(col, event.clientX, event.clientY)
                    }}
                  >
                    {colLetter(col)}
                    <div
                      className="resize-handle"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        props.resizeColumn(col, event.clientX, width)
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((rowIndex) => (
                <TableRow
                  key={rowIndex}
                  rowIndex={rowIndex}
                  row={props.cells[rowIndex]}
                  displayRow={props.display[rowIndex]}
                  selectedCol={props.selectedCol}
                  selectedRow={props.selectedRow}
                  isEditing={props.isEditing}
                  editValue={props.editValue}
                  cellStyles={props.cellStyles}
                  isInRange={props.isInRange}
                  selectCell={props.selectCell}
                  startEditing={props.startEditing}
                  saveEdit={props.saveEdit}
                  setEditValue={props.setEditValue}
                  openRowMenu={props.openRowMenu}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {props.menu && (
        <div ref={menuRef} className="context-menu" style={{ top: props.menu.y, left: props.menu.x }}>
          {props.menu.row !== undefined && (
            <>
              <div className="menu-item" onClick={() => { props.addRowBelow(props.menu!.row!); props.closeMenu() }}>
                Добавить строку ниже
              </div>
              <div className="menu-item" onClick={() => { props.deleteRow(props.menu!.row!); props.closeMenu() }}>
                Удалить строку
              </div>
            </>
          )}
          {props.menu.col !== undefined && (
            <>
              <div className="menu-item" onClick={() => { props.addColumnRight(props.menu!.col!); props.closeMenu() }}>
                Добавить столбец справа
              </div>
              <div className="menu-item" onClick={() => { props.deleteColumn(props.menu!.col!); props.closeMenu() }}>
                Удалить столбец
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}