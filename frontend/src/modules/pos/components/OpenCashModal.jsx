import { useState } from 'react'
import { usePosStore } from '../store/posStore'
import { usePos } from '../hooks/usePos'

function OpenCashModal({ onClose }) {
  const [saldoInicial, setSaldoInicial] = useState(0)
  const { handleOpenCash } = usePos()
  const { estadoCarga, error } = usePosStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleOpenCash({ saldo_inicial: Number(saldoInicial) })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Abrir caja</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Saldo inicial
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
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
              {estadoCarga === 'loading' ? 'Guardando...' : 'Abrir caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OpenCashModal
