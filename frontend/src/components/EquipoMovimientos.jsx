import Table from './Table'

function EquipoMovimientos({ movimientos = [] }) {
  const columns = [
    { key: 'fecha', label: 'Fecha', accessor: 'fecha' },
    { key: 'desde', label: 'Desde', accessor: 'desdeUbicacion' },
    { key: 'hacia', label: 'Hacia', accessor: 'haciaUbicacion' },
    { key: 'usuario', label: 'Usuario', accessor: 'usuario' },
    { key: 'motivo', label: 'Motivo', accessor: 'motivo' },
  ]

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Movimientos y asignaciones</h3>
        <p className="text-sm text-slate-600">Trazabilidad de ubicaciones del equipo.</p>
      </div>
      <Table columns={columns} data={movimientos} emptyMessage="Sin movimientos registrados." />
    </div>
  )
}

export default EquipoMovimientos
