import { useState } from 'react'
import { usePos } from '../hooks/usePos'
import { usePosStore } from '../store/posStore'

function CloseCashModal({ onClose }) {
  const [efectivoReal, setEfectivoReal] = useState(0)
  const { cajaAbierta } = usePosStore()
  const { handleCloseCash } = usePos()
  const { estadoCarga, error } = usePosStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleCloseCash({ efectivo_real: Number(efectivoReal) })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Cerrar caja</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {cajaAbierta ? (
          <div className="bg-slate-50 border rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-semibold">Estado:</span> {cajaAbierta.estado}</div>
            <div><span className="font-semibold">Apertura:</span> {cajaAbierta.abierta_en}</div>
            <div><span className="font-semibold">Saldo inicial:</span> ${cajaAbierta.saldo_inicial}</div>
            <div><span className="font-semibold">Total ventas:</span> ${cajaAbierta.total_ventas || 0}</div>
          </div>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Efectivo real contado
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={efectivoReal}
              onChange={(e) => setEfectivoReal(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
              disabled={estadoCarga === 'loading'}
            >
              {estadoCarga === 'loading' ? 'Cerrando...' : 'Cerrar caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CloseCashModal
