import { useEffect, useState } from 'react'
import OpenCashModal from '../components/OpenCashModal'
import CloseCashModal from '../components/CloseCashModal'
import ProductSearch from '../components/ProductSearch'
import Cart from '../components/Cart'
import PaymentDialog from '../components/PaymentDialog'
import TicketPreview from '../components/TicketPreview'
import { usePosStore } from '../store/posStore'
import { usePos } from '../hooks/usePos'

function PosPage() {
  const { cajaAbierta, estadoCarga, setTicketActual, limpiarVenta, descuentoGlobal } = usePosStore()
  usePos()
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    limpiarVenta()
    setTicketActual(null)
  }, [limpiarVenta, setTicketActual])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border rounded-xl p-4">
        <div>
          <div className="text-sm text-slate-500">POS / Caja</div>
          {cajaAbierta ? (
            <div className="text-lg font-semibold">
              Caja #{cajaAbierta.id} abierta desde {cajaAbierta.abierta_en}
            </div>
          ) : (
            <div className="text-lg font-semibold">No hay caja abierta</div>
          )}
        </div>
        <div className="flex gap-3">
          {!cajaAbierta && (
            <button
              onClick={() => setShowOpenModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              Abrir caja
            </button>
          )}
          {cajaAbierta && (
            <button
              onClick={() => setShowCloseModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Cerrar caja
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ProductSearch />
        </div>
        <div className="space-y-4">
          <Cart />
          <button
            onClick={() => setShowPayment(true)}
            className="w-full px-6 py-4 text-lg rounded-xl bg-emerald-700 text-white disabled:opacity-50"
            disabled={!cajaAbierta || estadoCarga === 'loading'}
          >
            Cobrar
          </button>
          <TicketPreview onNewSale={() => {
            limpiarVenta()
            setTicketActual(null)
          }} />
        </div>
      </div>

      {showOpenModal && <OpenCashModal onClose={() => setShowOpenModal(false)} />}
      {showCloseModal && <CloseCashModal onClose={() => setShowCloseModal(false)} />}
        {showPayment && (
          <PaymentDialog
            onClose={() => setShowPayment(false)}
            descuentoGlobal={descuentoGlobal}
          />
        )}
    </div>
  )
}

export default PosPage
