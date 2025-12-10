import { useMemo, useState } from 'react'
import { usePos } from '../hooks/usePos'
import { usePosStore } from '../store/posStore'

const medios = ['efectivo', 'debito', 'credito', 'transferencia']

function PaymentDialog({ onClose }) {
  const { itemsCarrito, descuentoGlobal, limpiarVenta, setTicketActual } = usePosStore()
  const { handleCreateSale } = usePos()
  const [pagos, setPagos] = useState([
    { tipo: 'efectivo', monto: 0 },
  ])
  const [modo, setModo] = useState('sin_arca')
  const [error, setError] = useState(null)

  const resumen = useMemo(() => {
    const subtotal = itemsCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    const descuento = subtotal * (Number(descuentoGlobal) / 100)
    const total = subtotal - descuento
    const totalPagos = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0)
    const efectivo = pagos
      .filter((p) => p.tipo === 'efectivo')
      .reduce((acc, p) => acc + Number(p.monto || 0), 0)
    const otros = totalPagos - efectivo
    const vuelto = Math.max(efectivo - Math.max(total - otros, 0), 0)
    return { subtotal, descuento, total, totalPagos, vuelto }
  }, [itemsCarrito, descuentoGlobal, pagos])

  const actualizarPago = (index, campo, valor) => {
    setPagos((prev) => prev.map((p, idx) => (idx === index ? { ...p, [campo]: valor } : p)))
  }

  const agregarPago = () => setPagos((prev) => [...prev, { tipo: 'efectivo', monto: 0 }])

  const eliminarPago = (index) => setPagos((prev) => prev.filter((_, idx) => idx !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        items: itemsCarrito.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })),
        descuento_porcentaje: descuentoGlobal,
        pagos: pagos.map((p) => ({ tipo: p.tipo, monto: Number(p.monto) })),
        modo,
      }
      const response = await handleCreateSale(payload)
      setTicketActual(response.ticket)
      limpiarVenta()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cobrar')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Cobrar venta</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {pagos.map((pago, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <select
                  value={pago.tipo}
                  onChange={(e) => actualizarPago(idx, 'tipo', e.target.value)}
                  className="col-span-4 border rounded-lg px-3 py-2"
                >
                  {medios.map((medio) => (
                    <option key={medio} value={medio}>
                      {medio.toUpperCase()}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pago.monto}
                  onChange={(e) => actualizarPago(idx, 'monto', e.target.value)}
                  className="col-span-6 border rounded-lg px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => eliminarPago(idx)}
                  className="col-span-2 text-red-600 text-sm"
                  disabled={pagos.length === 1}
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarPago}
              className="px-3 py-2 text-sm rounded-lg border border-dashed"
            >
              Añadir medio de pago
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${resumen.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento</span>
              <span className="font-semibold text-amber-600">-${resumen.descuento.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold col-span-2">
              <span>Total a cobrar</span>
              <span>${resumen.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total pagos</span>
              <span className="font-semibold">${resumen.totalPagos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vuelto</span>
              <span className="font-semibold">${resumen.vuelto.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Modo</label>
            <select
              value={modo}
              onChange={(e) => setModo(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="sin_arca">Sin ARCA</option>
              <option value="con_arca">Con ARCA</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              Confirmar cobro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentDialog
