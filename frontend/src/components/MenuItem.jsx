import { NavLink } from 'react-router-dom'

const paddingByDepth = {
  0: 'pl-3',
  1: 'pl-8',
  2: 'pl-12',
}

function MenuItem({ to, label, icon: Icon, depth = 0, onNavigate }) {
  const paddingClass = paddingByDepth[Math.min(depth, 2)]

  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 ${paddingClass} pr-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
          isActive
            ? 'bg-white text-indigo-700 border-indigo-100 shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        }`
      }
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default MenuItem
