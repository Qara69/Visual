export type Document = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  cells: string[][]
  colWidths: number[]
  rows: number
  cols: number
}