type Props = {
  address: string
  value: string
}

export function Panel({ address, value }: Props) {
  return (
    <div className="panel">
      <div className="address">{address}</div>
      <div className="cellValue">{value}</div>
    </div>
  )
}