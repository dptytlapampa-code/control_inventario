import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import MenuItem from './MenuItem'

function MenuGroup({ label, icon: Icon, items, isOpen, onToggle, activePath, onNavigate }) {
  const contentRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState('0px')

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isOpen, items])

  const hasActiveChild = useMemo(() => items.some((item) => activePath.startsWith(item.path)), [activePath, items])

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors border ${
          isOpen || hasActiveChild
            ? 'bg-white text-indigo-700 border-indigo-100 shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="truncate">{label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ maxHeight }}
      >
        <div className="py-1 space-y-1">
          {items.map((item) => (
            <MenuItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              depth={1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuGroup
