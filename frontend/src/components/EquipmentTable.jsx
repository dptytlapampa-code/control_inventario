import {
  Eye,
  FileClock,
  Laptop,
  Monitor,
  Pencil,
  Printer,
  RotateCcw,
  Settings,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import Table from './Table'

const typeIcons = {
  Computadora: Laptop,
  Monitor: Monitor,
  Impresora: Printer,
  'Equipo Médico': Settings,
  Servidor: RotateCcw,
}

function EquipmentTable({ data = [] }) {
  const navigate = useNavigate()
  const columns = [
    {
      key: 'tipo',
      label: '',
      render: (row) => {
        const Icon = typeIcons[row.tipo] || Laptop
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
            <Icon size={18} />
          </div>
        )
      },
    },
    { key: 'serie', label: 'Número de serie', accessor: 'serie' },
    { key: 'bien', label: 'Bien patrimonial', accessor: 'bienPatrimonial' },
    {
      key: 'marcaModelo',
      label: 'Marca y modelo',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.marca}</div>
          <div className="text-sm text-slate-600">{row.modelo}</div>
        </div>
      ),
    },
    { key: 'tipoLabel', label: 'Tipo', accessor: 'tipo' },
    {
      key: 'ubicacion',
      label: 'Ubicación',
      render: (row) => (
        <div className="text-sm text-slate-700">
          <div className="font-semibold text-slate-900">{row.institucion}</div>
          <div className="text-slate-600">{row.servicio} → {row.oficina}</div>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'detalle',
      label: 'Detalle',
      render: (row) => (
        <ActionButton
          icon={<Eye size={16} />}
          label="Ver detalle"
          onClick={() => navigate(`/equipos/${row.id}`)}
        />
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div className="flex flex-wrap gap-2 text-slate-500">
          <ActionButton icon={<Eye size={16} />} label="Ver" onClick={() => navigate(`/equipos/${row.id}`)} />
          <ActionButton icon={<Pencil size={16} />} label="Editar" onClick={() => console.log('Editar', row.id)} />
          <ActionButton
            icon={<RotateCcw size={16} />}
            label="Mover"
            onClick={() => console.log('Mover', row.id)}
          />
          <ActionButton
            icon={<FileClock size={16} />}
            label="Historial"
            onClick={() => console.log('Historial', row.id)}
          />
          <ActionButton icon={<Trash2 size={16} />} label="Baja" onClick={() => console.log('Baja', row.id)} />
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={data} emptyMessage="No se encontraron equipos con los filtros seleccionados." />
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default EquipmentTable
