import { useEffect, useRef } from "react"

const ROW_HEIGHT = 28
const BUFFER = 5

function colLetter(n: number) {
  return n < 26 ? String.fromCharCode(65 + n) : String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26))
}

export function Table(props: any) {
  const menuRef = useRef<any>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target)) props.onCloseMenu() }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const start = Math.max(0, Math.floor(props.scrollTop / ROW_HEIGHT) - BUFFER)
  const end = Math.min(props.cells.length, Math.ceil((props.scrollTop + props.containerHeight) / ROW_HEIGHT) + BUFFER)
  const visible = []
  for (let i = start; i < end; i++) visible.push(i)

  return (
    <div className="tableWrap" tabIndex={0} onKeyDown={props.onKeyDown} onScroll={props.onScroll}>
      <div style={{ height: props.cells.length * ROW_HEIGHT, position: "relative" }}>
        <div style={{ position: "absolute", top: start * ROW_HEIGHT, left: 0, right: 0 }}>
          <table className="spreadsheet">
            <thead>
              <tr><th style={{ width: 50 }}></th>
                {props.colWidths.map((w: number, c: number) => (
                  <th key={c} style={{ width: w }} onContextMenu={(e) => { e.preventDefault(); props.onOpenColMenu(c, e.clientX, e.clientY) }}>
                    {colLetter(c)}
                    <div className="resizeHandle" onMouseDown={(e) => { e.preventDefault(); props.onResize(c, e.clientX, w) }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((rowIdx: number) => (
                <tr key={rowIdx}>
                  <td onContextMenu={(e) => { e.preventDefault(); props.onOpenRowMenu(rowIdx, e.clientX, e.clientY) }}>{rowIdx + 1}</td>
                  {props.cells[rowIdx].map((_: any, colIdx: number) => {
                    const isSelected = colIdx === props.selectedCol && rowIdx === props.selectedRow
                    return (
                      <td key={colIdx}
                        className={`cell ${isSelected ? "selected" : ""} ${props.isInRange(colIdx, rowIdx) ? "range" : ""}`}
                        onClick={(e) => props.onSelectCell(colIdx, rowIdx, e.shiftKey)}
                        onDoubleClick={props.onDoubleClick}>
                        {isSelected && props.editing ? (
                          <input className="cellInput" value={props.editText} onChange={(e) => props.onChangeText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && props.onSave()} onBlur={props.onSave} autoFocus />
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
            <><div className="menuItem" onClick={() => { props.onAddRowAt(props.menu.row); props.onCloseMenu() }}>Добавить строку ниже</div>
            <div className="menuItem" onClick={() => { props.onDeleteRowAt(props.menu.row); props.onCloseMenu() }}>Удалить строку</div></>
          )}
          {props.menu.col !== undefined && (
            <><div className="menuItem" onClick={() => { props.onAddColAt(props.menu.col); props.onCloseMenu() }}>Добавить столбец справа</div>
            <div className="menuItem" onClick={() => { props.onDeleteColAt(props.menu.col); props.onCloseMenu() }}>Удалить столбец</div></>
          )}
        </div>
      )}
    </div>
  )
}