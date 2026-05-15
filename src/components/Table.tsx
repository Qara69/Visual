import { useEffect, useRef } from 'react'

const ROW_HEIGHT = 28
const BUFFER = 5

function colLetter(n: number) {
  if (n < 26) return String.fromCharCode(65 + n)
  return String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26))
}

export function Table(props: any) {
  const menuRef = useRef<any>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        props.closeMenu()
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  if (!props.cells || props.cells.length === 0) {
    return <div style={{ padding: 20 }}>Загрузка таблицы...</div>
  }

  const start = Math.max(0, Math.floor(props.scrollTop / ROW_HEIGHT) - BUFFER)
  const end = Math.min(props.cells.length, Math.ceil((props.scrollTop + props.containerHeight) / ROW_HEIGHT) + BUFFER)
  
  const visible = []
  for (let i = start; i < end; i++) {
    visible.push(i)
  }

  const totalHeight = props.cells.length * ROW_HEIGHT
  const offsetY = start * ROW_HEIGHT

  return (
    <div className="tableWrap" tabIndex={0} onKeyDown={props.handleKeyDown} onScroll={props.handleScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          <table className="spreadsheet">
            <thead>
              <tr>
                <th className="colHeader" style={{ width: 50 }}></th>
                {props.colWidths?.map((w: number, c: number) => (
                  <th key={c} className="colHeader" style={{ width: w }}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      props.openColMenu(c, e.clientX, e.clientY)
                    }}>
                    {colLetter(c)}
                    <div className="resizeHandle" onMouseDown={(e) => {
                      e.preventDefault()
                      props.resizeColumn(c, e.clientX, w)
                    }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((rowIdx: number) => {
                const row = props.cells[rowIdx]
                const displayRow = props.display?.[rowIdx]
                if (!row) return null
                
                return (
                  <tr key={rowIdx}>
                    <td className="rowHeader" onContextMenu={(e) => {
                      e.preventDefault()
                      props.openRowMenu(rowIdx, e.clientX, e.clientY)
                    }}>
                      {rowIdx + 1}
                    </td>
                    {row.map((_: any, colIdx: number) => {
                      const isSelected = colIdx === props.selectedCol && rowIdx === props.selectedRow
                      const inRange = props.isInRange?.(colIdx, rowIdx) || false
                      const cellValue = displayRow?.[colIdx] || ''
                      
                      return (
                        <td key={colIdx}
                          className={`cell ${isSelected ? 'selected' : ''} ${inRange ? 'range' : ''}`}
                          onClick={(e) => props.selectCell(colIdx, rowIdx, e.shiftKey)}
                          onDoubleClick={props.startEditing}>
                          {isSelected && props.isEditing ? (
                            <input className="cellInput" value={props.editValue}
                              onChange={(e) => props.setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && props.saveEdit()}
                              onBlur={props.saveEdit} autoFocus />
                          ) : (
                            <div className="cellText">{cellValue}</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {props.menu && (
        <div ref={menuRef} className="contextMenu" style={{ top: props.menu.y, left: props.menu.x }}>
          {props.menu.row !== undefined && (
            <>
              <div className="menuItem" onClick={() => { props.addRowBelow(props.menu.row); props.closeMenu() }}>
                Добавить строку ниже
              </div>
              <div className="menuItem" onClick={() => { props.deleteRow(props.menu.row); props.closeMenu() }}>
                Удалить строку
              </div>
            </>
          )}
          {props.menu.col !== undefined && (
            <>
              <div className="menuItem" onClick={() => { props.addColumnRight(props.menu.col); props.closeMenu() }}>
                Добавить столбец справа
              </div>
              <div className="menuItem" onClick={() => { props.deleteColumn(props.menu.col); props.closeMenu() }}>
                Удалить столбец
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}