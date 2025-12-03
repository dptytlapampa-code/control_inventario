import { PanelLeft } from 'lucide-react'

function Navbar({ onToggleSidebar }) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={onToggleSidebar}
          aria-label="Abrir menú lateral"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xl font-semibold text-slate-900">Control Inventario</p>
          <p className="text-xs text-slate-500">Panel de monitoreo</p>
        </div>
      </div>
    </header>
  )
}

export default Navbar
