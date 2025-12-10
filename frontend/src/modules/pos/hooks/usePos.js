import { useEffect } from 'react'
import {
  closeCashbox,
  createSale,
  getOpenCashbox,
  openCashbox,
} from '../api/posApi'
import { usePosStore } from '../store/posStore'

export const usePos = () => {
  const {
    cajaAbierta,
    setCajaAbierta,
    setEstadoCarga,
    setError,
    limpiarVenta,
    setTicketActual,
  } = usePosStore()

  useEffect(() => {
    (async () => {
      try {
        setEstadoCarga('loading')
        const response = await getOpenCashbox()
        setCajaAbierta(response.data || null)
        setEstadoCarga('idle')
      } catch (error) {
        setEstadoCarga('idle')
      }
    })()
  }, [setCajaAbierta, setEstadoCarga])

  const handleOpenCash = async (payload) => {
    setEstadoCarga('loading')
    try {
      const response = await openCashbox(payload)
      setCajaAbierta(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo abrir caja')
    } finally {
      setEstadoCarga('idle')
    }
  }

  const handleCloseCash = async (payload) => {
    setEstadoCarga('loading')
    try {
      const response = await closeCashbox(payload)
      setCajaAbierta(null)
      setTicketActual(null)
      limpiarVenta()
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo cerrar caja')
      throw error
    } finally {
      setEstadoCarga('idle')
    }
  }

  const handleCreateSale = async (payload) => {
    setEstadoCarga('loading')
    try {
      const response = await createSale(payload)
      setTicketActual(response.ticket)
      return response
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo registrar la venta')
      throw error
    } finally {
      setEstadoCarga('idle')
    }
  }

  return {
    cajaAbierta,
    handleOpenCash,
    handleCloseCash,
    handleCreateSale,
  }
}
