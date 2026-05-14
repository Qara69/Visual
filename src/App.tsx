import { useRef, useState, useEffect } from "react"
import { Table } from "./components/Table"
import { Panel } from "./components/Panel"
import { useSpreadsheet } from "./hooks/useSpreadsheet"

export function App() {
  const s = useSpreadsheet()
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(600)

  useEffect(() => {
    if (ref.current) setHeight(ref.current.clientHeight)
  }, [])

  return (
    <div className="app" ref={ref}>
      <div className="header">Табличный процессор</div>
      <Panel address={s.address} value={s.currentValue} />
      <Table
        cells={s.cells}
        display={s.display}
        colWidths={s.colWidths}
        selectedCol={s.selectedCol}
        selectedRow={s.selectedRow}
        editing={s.editing}
        editText={s.editText}
        scrollTop={s.scrollTop}
        containerHeight={height}
        menu={s.menu}
        isInRange={s.isInRange}
        onSelectCell={s.selectCell}
        onDoubleClick={s.startEdit}
        onSave={s.saveEdit}
        onChangeText={s.changeEditText}
        onResize={s.resizeColumn}
        onAddRowAt={s.addRowAt}
        onDeleteRowAt={s.deleteRowAt}
        onAddColAt={s.addColAt}
        onDeleteColAt={s.deleteColAt}
        onOpenRowMenu={s.openRowMenu}
        onOpenColMenu={s.openColMenu}
        onCloseMenu={s.closeMenu}
        onKeyDown={s.handleKeyDown}
        onScroll={s.handleScroll}
      />
    </div>
  )
}