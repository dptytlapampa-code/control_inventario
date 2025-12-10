import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  BadgeCheck,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FilePlus,
  FileText,
  Files,
  History,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Stethoscope,
  Truck,
  Wrench,
  Landmark,
  Laptop2,
  ListChecks,
  Shapes,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MenuGroup from './MenuGroup'
import MenuItem from './MenuItem'

const MENU_STRUCTURE = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    id: 'instituciones',
    label: 'Instituciones',
    icon: Building2,
    children: [
      { label: 'Listado', path: '/instituciones/listado', icon: Landmark },
      { label: 'Servicios', path: '/instituciones/servicios', icon: Stethoscope },
      { label: 'Oficinas', path: '/instituciones/oficinas', icon: Landmark },
    ],
  },
  {
    id: 'equipos',
    label: 'Equipos',
    icon: Laptop2,
    children: [
      { label: 'Listado', path: '/equipos/listado', icon: ListChecks },
      { label: 'Tipos', path: '/equipos/tipos', icon: Shapes },
    ],
  },
  {
    id: 'asignaciones',
    label: 'Asignaciones',
    icon: ClipboardCheck,
    path: '/asignaciones',
  },
  {
    id: 'mantenimientos',
    label: 'Mantenimientos',
    icon: Wrench,
    children: [
      { label: 'Historial', path: '/mantenimientos/historial', icon: History },
      { label: 'Programar', path: '/mantenimientos/programar', icon: CalendarClock },
      { label: 'Servicios técnicos externos', path: '/mantenimientos/servicios-externos', icon: Truck },
    ],
  },
  {
    id: 'actas',
    label: 'Actas',
    icon: FileText,
    children: [
      { label: 'Listado', path: '/actas/listado', icon: Files },
      { label: 'Nueva acta', path: '/actas/nueva', icon: FilePlus },
    ],
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: BarChart3,
    path: '/reportes',
  },
  {
    id: 'administracion',
    label: 'Administración',
    icon: ShieldCheck,
    children: [
      { label: 'Usuarios', path: '/administracion/usuarios', icon: Users },
      { label: 'Roles y permisos', path: '/administracion/roles-permisos', icon: BadgeCheck },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: Settings,
    children: [{ label: 'Módulos por institución', path: '/configuracion/modulos', icon: PanelsTopLeft }],
  },
]

function Sidebar({ active = '', isOpen = false, onClose }) {
  const navigate = useNavigate()
  const [openGroup, setOpenGroup] = useState(null)

  const initialGroup = useMemo(() => {
    const match = MENU_STRUCTURE.find((item) => item.children?.some((child) => active.startsWith(child.path)))
    return match?.id || null
  }, [active])

  useEffect(() => {
    setOpenGroup(initialGroup)
  }, [initialGroup])

  const handleGroupToggle = (id) => {
    setOpenGroup((current) => (current === id ? null : id))
  }

  const handleNavigate = (path) => {
    if (path) {
      navigate(path)
    }
    if (onClose) {
      onClose()
    }
  }

  const mobileOverlayClasses = `fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`

  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 shadow-md flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`

  return (
    <>
      <div className={mobileOverlayClasses} onClick={onClose} />
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-2 text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
              CI
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Control Inventario</p>
              <p className="text-xs text-slate-500">Panel principal</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar menú"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {MENU_STRUCTURE.map((item) => {
            if (item.children) {
              return (
                <MenuGroup
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  items={item.children}
                  isOpen={openGroup === item.id}
                  onToggle={() => handleGroupToggle(item.id)}
                  activePath={active}
                  onNavigate={onClose}
                />
              )
            }

            return (
              <MenuItem
                key={item.id}
                to={item.path}
                label={item.label}
                icon={item.icon}
                onNavigate={onClose}
              />
            )
          })}
        </div>

        <div className="px-4 py-3 border-t border-slate-200 bg-white/80">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Menu className="w-4 h-4" />
            <span>Menú lateral profesional y escalable</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
