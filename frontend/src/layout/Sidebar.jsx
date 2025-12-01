import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/hospitales', label: 'Hospitales' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/oficinas', label: 'Oficinas' },
  { to: '/equipos', label: 'Equipos' },
  { to: '/mantenimientos', label: 'Mantenimientos' },
  { to: '/actas', label: 'Actas' },
  { to: '/configuracion', label: 'Configuración' },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen shadow-sm">
      <div className="px-6 py-4 text-lg font-semibold text-slate-900 border-b border-slate-200">Menú</div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
