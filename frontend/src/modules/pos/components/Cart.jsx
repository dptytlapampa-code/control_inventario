import { useMemo } from 'react'
import { usePosStore } from '../store/posStore'

function Cart() {
  const {
    itemsCarrito,
    eliminarItem,
    cambiarCantidad,
    descuentoGlobal,
    setDescuentoGlobal,
  } = usePosStore()

  const resumen = useMemo(() => {
    const subtotal = itemsCarrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    )
    const descuento = subtotal * (Number(descuentoGlobal) / 100)
    const total = subtotal - descuento
    const totalCosto = itemsCarrito.reduce(
      (acc, item) => acc + item.costo * item.cantidad,
      0
    )
    return { subtotal, descuento, total, totalCosto }
  }, [itemsCarrito, descuentoGlobal])

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Carrito</h3>
        <span className="text-sm text-slate-500">{itemsCarrito.length} ítems</span>
      </div>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {itemsCarrito.map((item) => (
          <div
            key={item.producto_id}
            className="grid grid-cols-12 items-center gap-2 border rounded-lg px-3 py-2"
          >
            <div className="col-span-5">
              <div className="font-semibold">{item.nombre}</div>
              <div className="text-sm text-slate-500">${item.precio}</div>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => cambiarCantidad(item.producto_id, Number(e.target.value))}
                className="w-20 border rounded-lg px-2 py-1"
              />
              <button
                className="text-red-600 text-sm"
                onClick={() => eliminarItem(item.producto_id)}
              >
                Quitar
              </button>
            </div>
            <div className="col-span-4 text-right font-semibold">
              ${(item.precio * item.cantidad).toFixed(2)}
            </div>
          </div>
        ))}
        {itemsCarrito.length === 0 && (
          <div className="text-sm text-slate-500">Añade productos para iniciar.</div>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">${resumen.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Descuento (%)</span>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={descuentoGlobal}
              onChange={(e) => setDescuentoGlobal(Number(e.target.value))}
              className="w-20 border rounded-lg px-2 py-1"
            />
          </div>
          <span className="font-semibold text-amber-600">-
            ${resumen.descuento.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${resumen.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Cart
