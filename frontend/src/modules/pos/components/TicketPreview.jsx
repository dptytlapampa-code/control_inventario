import { usePosStore } from '../store/posStore'

function TicketPreview({ onNewSale }) {
  const { ticketActual } = usePosStore()

  if (!ticketActual) return null

  const handlePrint = () => window.print()

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {ticketActual.encabezado}
        </div>
        <div className="text-lg font-semibold mt-1">Ticket #{ticketActual.numero_ticket}</div>
        <div className="text-sm text-slate-500">{ticketActual.fecha}</div>
      </div>
      <div className="divide-y">
        {ticketActual.items?.map((item, idx) => (
          <div key={idx} className="py-2 flex justify-between text-sm">
            <div>
              <div className="font-semibold">{item.descripcion}</div>
              <div className="text-slate-500">x{item.cantidad}</div>
            </div>
            <div className="text-right">
              <div>${item.precio_unitario}</div>
              <div className="font-semibold">${item.subtotal}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${ticketActual.subtotal}</span>
        </div>
        <div className="flex justify-between text-amber-600">
          <span>Descuento ({ticketActual.descuento_porcentaje}%)</span>
          <span>-${ticketActual.descuento_monto}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${ticketActual.total}</span>
        </div>
        <div className="space-y-1">
          <div className="font-semibold">Pagos</div>
          {ticketActual.pagos?.map((pago) => (
            <div key={`${pago.tipo}-${pago.id || Math.random()}`} className="flex justify-between">
              <span>{pago.tipo.toUpperCase()}</span>
              <span>${pago.monto}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold">
            <span>Vuelto</span>
            <span>${ticketActual.vuelto}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handlePrint} className="px-4 py-2 border rounded-lg w-full">
          Imprimir
        </button>
        <button
          onClick={onNewSale}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg w-full"
        >
          Nueva venta
        </button>
      </div>
    </div>
  )
}

export default TicketPreview
