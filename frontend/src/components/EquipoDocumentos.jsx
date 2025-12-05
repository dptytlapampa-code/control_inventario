import { useMemo, useState } from 'react'
import { Download, Eye, FilePlus, Trash2 } from 'lucide-react'
import Table from './Table'

const typeStyles = {
  Factura: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  Presupuesto: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  Acta: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  Patrimonio: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  Foto: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
  Otro: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
}

function EquipoDocumentos({ documentos = [] }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const columns = useMemo(
    () => [
      {
        key: 'tipo',
        label: 'Tipo',
        render: (row) => {
          const variant = typeStyles[row.tipo] || typeStyles.Otro
          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${variant}`}>
              {row.tipo}
            </span>
          )
        },
      },
      { key: 'nombreArchivo', label: 'Nombre de archivo', accessor: 'nombreArchivo' },
      { key: 'fecha', label: 'Fecha', accessor: 'fecha' },
      { key: 'usuario', label: 'Usuario', accessor: 'usuario' },
      {
        key: 'acciones',
        label: 'Acciones',
        render: () => (
          <div className="flex flex-wrap gap-2">
            <ActionButton icon={<Eye size={16} />} label="Ver" />
            <ActionButton icon={<Download size={16} />} label="Descargar" />
            <ActionButton icon={<Trash2 size={16} />} label="Eliminar" variant="danger" />
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Documentos asociados</h3>
          <p className="text-sm text-slate-600">Archivos y comprobantes vinculados al equipo.</p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <FilePlus size={16} />
          Subir documento
        </button>
      </div>

      {mostrarFormulario && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">Formulario de carga (mock)</h4>
          <p className="text-sm text-slate-600">
            Aquí se mostraría un formulario para subir archivos y completar metadatos. Funcionalidad no implementada.
          </p>
        </div>
      )}

      <Table
        columns={columns}
        data={documentos}
        emptyMessage="No hay documentos asociados a este equipo."
      />
    </div>
  )
}

function ActionButton({ icon, label, variant = 'default' }) {
  const base = 'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition'
  const styles =
    variant === 'danger'
      ? 'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50'
      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'

  return (
    <button type="button" className={`${base} ${styles}`}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default EquipoDocumentos
