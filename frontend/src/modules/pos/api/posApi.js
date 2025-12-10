import api from '../../../utils/api'

const authHeaders = async () => {
  const token = localStorage.getItem('kc_token') || ''
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export const getOpenCashbox = async () => {
  const headers = await authHeaders()
  const { data } = await api.get('/pos/caja/abierta', { headers })
  return data
}

export const openCashbox = async (payload) => {
  const headers = await authHeaders()
  const { data } = await api.post('/pos/caja/abrir', payload, { headers })
  return data
}

export const closeCashbox = async (payload) => {
  const headers = await authHeaders()
  const { data } = await api.post('/pos/caja/cerrar', payload, { headers })
  return data
}

export const createSale = async (payload) => {
  const headers = await authHeaders()
  const { data } = await api.post('/pos/ventas', payload, { headers })
  return data
}

export const getSale = async (id) => {
  const headers = await authHeaders()
  const { data } = await api.get(`/pos/ventas/${id}`, { headers })
  return data
}

export const searchProducts = async (query) => {
  const headers = await authHeaders()
  const { data } = await api.get('/productos', { params: { q: query }, headers })
  return data
}
