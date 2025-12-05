import { ArrowDownCircle, ArrowRightLeft, ArrowUpCircle, FileSignature, FileText, Wrench } from 'lucide-react'
import Table from './Table'

const typeIcons = {
  Mantenimiento: Wrench,
  Movimiento: ArrowRightLeft,
  Documento: FileText,
  Acta: FileSignature,
  Alta: ArrowUpCircle,
  Baja: ArrowDownCircle,
}

function EquipoHistorialTabla({ items = [] }) {
  const columns = [
    {
      key: 'tipoIcono',
      label: '',
      render: (row) => {
        const Icon = typeIcons[row.tipo] || FileText

        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
            <Icon size={18} />
          </div>
        )
      },
    },
    { key: 'fechaHora', label: 'Fecha', accessor: 'fechaHora' },
    { key: 'tipo', label: 'Tipo', accessor: 'tipo' },
    { key: 'usuario', label: 'Usuario', accessor: 'usuario' },
    { key: 'descripcion', label: 'Descripción', accessor: 'descripcion' },
  ]

  return (
    <Table
      columns={columns}
      data={items}
      emptyMessage="Aún no hay registros en el historial de este equipo."
    />
  )
}

export default EquipoHistorialTabla
