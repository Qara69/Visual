function parseCell(ref: string) {
  const colLetter = ref.match(/[A-Z]+/i)?.[0] || ""
  const rowNum = parseInt(ref.match(/\d+/)?.[0] || "1") - 1
  
  let col = 0
  for (let i = 0; i < colLetter.length; i++) {
    col = col * 26 + (colLetter[i].toUpperCase().charCodeAt(0) - 64)
  }
  col = col - 1
  
  return { col, row: rowNum }
}

function getCellValue(ref: string, cells: string[][]): number {
  const { col, row } = parseCell(ref)
  if (row >= 0 && row < cells.length && col >= 0 && col < cells[0].length) {
    return parseFloat(cells[row][col]) || 0
  }
  return 0
}

export function calculateFormula(formula: string, cells: string[][]): string {
  const upper = formula.toUpperCase()
  
  // =SUM
  if (upper.startsWith("=SUM(")) {
    const inside = upper.slice(5, -1)
    const [start, end] = inside.split(":")
    const startPos = parseCell(start)
    const endPos = parseCell(end)
    
    let sum = 0
    for (let c = startPos.col; c <= endPos.col; c++) {
      for (let r = startPos.row; r <= endPos.row; r++) {
        const val = parseFloat(cells[r]?.[c])
        if (!isNaN(val)) sum += val
      }
    }
    return String(sum)
  }
  
  // =AVERAGE
  if (upper.startsWith("=AVERAGE(")) {
    const inside = upper.slice(9, -1)
    const [start, end] = inside.split(":")
    const startPos = parseCell(start)
    const endPos = parseCell(end)
    
    let sum = 0
    let count = 0
    for (let c = startPos.col; c <= endPos.col; c++) {
      for (let r = startPos.row; r <= endPos.row; r++) {
        const val = parseFloat(cells[r]?.[c])
        if (!isNaN(val)) {
          sum += val
          count++
        }
      }
    }
    return count > 0 ? String(sum / count) : "0"
  }
  
  // =A1+B1
  const ops = ["+", "-", "*", "/"]
  for (const op of ops) {
    if (formula.includes(op)) {
      const [left, right] = formula.slice(1).split(op)
      const leftVal = getCellValue(left.trim(), cells)
      const rightVal = getCellValue(right.trim(), cells)
      
      if (op === "+") return String(leftVal + rightVal)
      if (op === "-") return String(leftVal - rightVal)
      if (op === "*") return String(leftVal * rightVal)
      if (op === "/") return rightVal !== 0 ? String(leftVal / rightVal) : "#ERROR"
    }
  }
  
  return formula
}

export function getCellAddress(col: number, row: number): string {
  let result = ""
  let num = col + 1
  while (num > 0) {
    num--
    result = String.fromCharCode(65 + (num % 26)) + result
    num = Math.floor(num / 26)
  }
  return result + (row + 1)
}