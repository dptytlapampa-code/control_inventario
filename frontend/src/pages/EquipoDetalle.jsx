import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClipboardList, MapPin, ShieldCheck, User } from 'lucide-react'
import Card from '../components/Card'
import EquipoHistorialTabla from '../components/EquipoHistorialTabla'
import EquipoDocumentos from '../components/EquipoDocumentos'
import EquipoMantenimientos from '../components/EquipoMantenimientos'
import EquipoMovimientos from '../components/EquipoMovimientos'
import Table from '../components/Table'

const estadoStyles = {
  Operativo: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'En servicio técnico': 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  Baja: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
}

function EquipoDetalle() {
  const { equipoId } = useParams()
  const [activeTab, setActiveTab] = useState('resumen')

  const equipo = useMemo(
    () => ({
      id: equipoId,
      tipoEquipo: 'Notebook',
      marca: 'HP',
      modelo: 'EliteBook 840 G9',
      numeroSerie: 'SN-001245',
      bienPatrimonial: 'BP-1023',
      estadoActual: 'Operativo',
      ubicacion: {
        institucion: 'Hospital Lucio Molas',
        servicio: 'Emergencias',
        oficina: 'Box 1',
      },
      usuarioResponsable: {
        nombre: 'Dr. María López',
        puesto: 'Jefa de Emergencias',
      },
      fechaAlta: '15/04/2024',
      ultimaAccion: 'Asignado a la oficina de Emergentología con periféricos completos.',
      historial: [
        {
          fechaHora: '20/05/2024 10:15',
          tipo: 'Mantenimiento',
          usuario: 'Técnico Juan Pérez',
          descripcion: 'Mantenimiento preventivo y limpieza interna realizada.',
        },
        {
          fechaHora: '05/05/2024 09:00',
          tipo: 'Movimiento',
          usuario: 'Coordinadora Ana Gómez',
          descripcion: 'Reubicación desde stock central hacia Emergencias - Box 1.',
        },
        {
          fechaHora: '16/04/2024 14:30',
          tipo: 'Documento',
          usuario: 'Administrador Pablo Ruiz',
          descripcion: 'Carga de factura de compra y comprobante de garantía.',
        },
        {
          fechaHora: '15/04/2024 08:00',
          tipo: 'Alta',
          usuario: 'Inventario Sistemas',
          descripcion: 'Ingreso inicial al inventario institucional.',
        },
      ],
      documentos: [
        {
          id: 1,
          tipo: 'Factura',
          nombreArchivo: 'Factura_Compra_HP_001245.pdf',
          fecha: '16/04/2024',
          usuario: 'Administrador Pablo Ruiz',
        },
        {
          id: 2,
          tipo: 'Acta',
          nombreArchivo: 'Acta_Asignacion_Notebook_HP.pdf',
          fecha: '18/04/2024',
          usuario: 'RRHH Sistemas',
        },
        {
          id: 3,
          tipo: 'Patrimonio',
          nombreArchivo: 'Etiqueta_Bien_BP1023.png',
          fecha: '18/04/2024',
          usuario: 'Inventario Sistemas',
        },
      ],
      mantenimientos: [
        {
          fecha: '20/05/2024',
          tipoMantenimiento: 'Preventivo',
          estado: 'Cerrado',
          responsable: 'Técnico Juan Pérez',
          comentario: 'Limpieza de ventiladores y chequeo de rendimiento.',
        },
        {
          fecha: '02/05/2024',
          tipoMantenimiento: 'Correctivo',
          estado: 'En curso',
          responsable: 'Soporte Nivel 1',
          comentario: 'Reemplazo de cargador dañado.',
        },
        {
          fecha: '25/04/2024',
          tipoMantenimiento: 'Servicio técnico externo',
          estado: 'Abierto',
          responsable: 'Proveedor HP',
          comentario: 'Consulta por extensión de garantía.',
        },
      ],
      movimientos: [
        {
          fecha: '05/05/2024',
          desdeUbicacion: 'Stock central',
          haciaUbicacion: 'Hospital Lucio Molas → Emergencias → Box 1',
          usuario: 'Coordinadora Ana Gómez',
          motivo: 'Asignación definitiva a box de emergencias',
        },
        {
          fecha: '18/04/2024',
          desdeUbicacion: 'Depósito Sistemas',
          haciaUbicacion: 'Stock central',
          usuario: 'Logística TIC',
          motivo: 'Preparación para asignación',
        },
      ],
      actas: [
        {
          fecha: '18/04/2024',
          numeroActa: 'ACT-2024-051',
          tipoActa: 'Entrega',
          estado: 'Firmada',
        },
        {
          fecha: '25/04/2024',
          numeroActa: 'ACT-2024-072',
          tipoActa: 'Préstamo',
          estado: 'Borrador',
        },
      ],
    }),
    [equipoId]
  )

  const tabs = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'historial', label: 'Historial' },
    { key: 'documentos', label: 'Documentos' },
    { key: 'mantenimientos', label: 'Mantenimientos' },
    { key: 'movimientos', label: 'Movimientos / Asignaciones' },
    { key: 'actas', label: 'Actas' },
  ]

  const badgeClass = estadoStyles[equipo.estadoActual] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-slate-500">Detalle de equipo</p>
          <h1 className="text-3xl font-semibold text-slate-900">{equipo.tipoEquipo} {equipo.marca}</h1>
          <p className="text-slate-600">Modelo {equipo.modelo} — SN: {equipo.numeroSerie}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Editar equipo', 'Mover equipo', 'Agregar documento', 'Agregar mantenimiento', 'Generar acta'].map(
            (label) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {label}
              </button>
            )
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
          >
            Dar de baja
          </button>
        </div>
      </header>

      <Card>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-slate-500" size={18} />
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Información básica</p>
                <h3 className="text-xl font-semibold text-slate-900">{equipo.tipoEquipo}</h3>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem label="Marca" value={equipo.marca} />
              <InfoItem label="Modelo" value={equipo.modelo} />
              <InfoItem label="Número de serie" value={equipo.numeroSerie} />
              <InfoItem label="Bien patrimonial" value={equipo.bienPatrimonial} />
            </dl>
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Última acción</p>
              <p>{equipo.ultimaAccion}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="text-slate-500" size={18} />
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Estado y ubicación</p>
                <h3 className="text-xl font-semibold text-slate-900">Situación actual</h3>
              </div>
            </div>
            <dl className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-sm font-semibold text-slate-800">Estado</dt>
                <dd>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                    {equipo.estadoActual}
                  </span>
                </dd>
              </div>
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin size={16} />
                  Ubicación
                </dt>
                <dd className="mt-1 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">{equipo.ubicacion.institucion}</div>
                  <div>{equipo.ubicacion.servicio} → {equipo.ubicacion.oficina}</div>
                </dd>
              </div>
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <User size={16} />
                  Responsable
                </dt>
                <dd className="mt-1 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">{equipo.usuarioResponsable.nombre}</div>
                  <div>{equipo.usuarioResponsable.puesto}</div>
                </dd>
              </div>
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                <dt className="text-sm font-semibold text-slate-800">Fecha de alta</dt>
                <dd className="text-sm text-slate-700">{equipo.fechaAlta}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-semibold transition hover:text-slate-900 ${
                activeTab === tab.key
                  ? 'text-slate-900'
                  : 'text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900" aria-hidden />
              )}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === 'resumen' && <Resumen equipo={equipo} />}
          {activeTab === 'historial' && <EquipoHistorialTabla items={equipo.historial} />}
          {activeTab === 'documentos' && <EquipoDocumentos documentos={equipo.documentos} />}
          {activeTab === 'mantenimientos' && <EquipoMantenimientos mantenimientos={equipo.mantenimientos} />}
          {activeTab === 'movimientos' && <EquipoMovimientos movimientos={equipo.movimientos} />}
          {activeTab === 'actas' && <ActasTable actas={equipo.actas} />}
        </div>
      </div>
    </section>
  )
}

function Resumen({ equipo }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">{equipo.ultimaAccion}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <HighlightCard title="Estado actual" value={equipo.estadoActual} />
          <HighlightCard title="Ubicación" value={`${equipo.ubicacion.servicio} → ${equipo.ubicacion.oficina}`} />
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-slate-200 p-4">
        <h4 className="text-sm font-semibold text-slate-900">Datos rápidos</h4>
        <ul className="space-y-1 text-sm text-slate-700">
          <li>Equipo: {equipo.tipoEquipo}</li>
          <li>Marca/Modelo: {equipo.marca} {equipo.modelo}</li>
          <li>Serie: {equipo.numeroSerie}</li>
          <li>Bien patrimonial: {equipo.bienPatrimonial}</li>
          <li>Responsable: {equipo.usuarioResponsable.nombre}</li>
        </ul>
      </div>
    </div>
  )
}

function HighlightCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-lg text-slate-900">{value}</p>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  )
}

function ActasTable({ actas = [] }) {
  const columns = [
    { key: 'fecha', label: 'Fecha', accessor: 'fecha' },
    { key: 'numeroActa', label: 'Número de acta', accessor: 'numeroActa' },
    { key: 'tipoActa', label: 'Tipo de acta', accessor: 'tipoActa' },
    { key: 'estado', label: 'Estado', accessor: 'estado' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: () => (
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Ver acta
        </button>
      ),
    },
  ]

  return <Table columns={columns} data={actas} emptyMessage="No hay actas registradas." />
}

export default EquipoDetalle
