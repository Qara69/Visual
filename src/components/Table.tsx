import { useEffect, useRef } from "react"

type Props = {
  cells: string[][]
  display: string[][]
  colWidths: number[]
  selectedCol: number
  selectedRow: number
  editing: boolean
  editText: string
  scrollTop: number
  containerHeight: number
  menu: { x: number; y: number; row?: number; col?: number } | null
  isInRange: (col: number, row: number) => boolean
  onSelectCell: (col: number, row: number, shift: boolean) => void
  onDoubleClick: () => void
  onSave: () => void
  onChangeText: (text: string) => void
  onResize: (col: number, startX: number, startWidth: number) => void
  onAddRowAt: (index: number) => void
  onDeleteRowAt: (index: number) => void
  onAddColAt: (index: number) => void
  onDeleteColAt: (index: number) => void
  onOpenRowMenu: (row: number, x: number, y: number) => void
  onOpenColMenu: (col: number, x: number, y: number) => void
  onCloseMenu: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

const ROW_HEIGHT = 28
const BUFFER = 5

function colLetter(n: number): string {
  if (n < 26) return String.fromCharCode(65 + n)
  return String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26))
}

export function Table(props: Props) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        props.onCloseMenu()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [props.onCloseMenu])

  const startIdx = Math.max(0, Math.floor(props.scrollTop / ROW_HEIGHT) - BUFFER)
  const endIdx = Math.min(props.cells.length, Math.ceil((props.scrollTop + props.containerHeight) / ROW_HEIGHT) + BUFFER)
  
  const visibleRows = []
  for (let i = startIdx; i < endIdx; i++) visibleRows.push(i)

  const totalHeight = props.cells.length * ROW_HEIGHT
  const offsetY = startIdx * ROW_HEIGHT

  return (
    <div className="tableWrap" tabIndex={0} onKeyDown={props.onKeyDown} onScroll={props.onScroll}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ position: "absolute", top: offsetY, left: 0, right: 0 }}>
          <table className="spreadsheet">
            <thead>
              <tr>
                <th className="colHeader" style={{ width: 50 }}></th>
                {props.colWidths.map((w, c) => (
                  <th key={c} className="colHeader" style={{ width: w }}
                    onContextMenu={(e) => { e.preventDefault(); props.onOpenColMenu(c, e.clientX, e.clientY) }}
                  >
                    {colLetter(c)}
                    <div className="resizeHandle" onMouseDown={(e) => { e.preventDefault(); props.onResize(c, e.clientX, w) }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map(rowIdx => (
                <tr key={rowIdx}>
                  <td className="rowHeader" onContextMenu={(e) => { e.preventDefault(); props.onOpenRowMenu(rowIdx, e.clientX, e.clientY) }}>
                    {rowIdx + 1}
                  </td>
                  {props.cells[rowIdx].map((_, colIdx) => {
                    const isSelected = colIdx === props.selectedCol && rowIdx === props.selectedRow
                    const inRange = props.isInRange(colIdx, rowIdx)
                    return (
                      <td key={colIdx}
                        className={`cell ${isSelected ? "selected" : ""} ${inRange ? "range" : ""}`}
                        onClick={(e) => props.onSelectCell(colIdx, rowIdx, e.shiftKey)}
                        onDoubleClick={props.onDoubleClick}
                      >
                        {isSelected && props.editing ? (
                          <input className="cellInput" value={props.editText}
                            onChange={(e) => props.onChangeText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && props.onSave()}
                            onBlur={props.onSave} autoFocus />
                        ) : (
                          <div className="cellText">{props.display[rowIdx][colIdx]}</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {props.menu && (
        <div ref={menuRef} className="contextMenu" style={{ top: props.menu.y, left: props.menu.x }}>
          {props.menu.row !== undefined && (
            <>
              <div className="menuItem" onClick={() => { props.onAddRowAt(props.menu!.row!); props.onCloseMenu() }}>Добавить строку ниже</div>
              <div className="menuItem" onClick={() => { props.onDeleteRowAt(props.menu!.row!); props.onCloseMenu() }}>Удалить строку</div>
            </>
          )}
          {props.menu.col !== undefined && (
            <>
              <div className="menuItem" onClick={() => { props.onAddColAt(props.menu!.col!); props.onCloseMenu() }}>Добавить столбец справа</div>
              <div className="menuItem" onClick={() => { props.onDeleteColAt(props.menu!.col!); props.onCloseMenu() }}>Удалить столбец</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}