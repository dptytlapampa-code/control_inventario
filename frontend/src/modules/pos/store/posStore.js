import { create } from 'zustand'

const initialState = {
  cajaAbierta: null,
  itemsCarrito: [],
  pagos: [],
  descuentoGlobal: 0,
  ticketActual: null,
  estadoCarga: 'idle',
  error: null,
}

const findItemIndex = (state, productoId) =>
  state.itemsCarrito.findIndex((i) => i.producto_id === productoId)

export const usePosStore = create((set) => ({
  ...initialState,
  setCajaAbierta: (caja) => set({ cajaAbierta: caja }),
  agregarItem: (producto, cantidad = 1) =>
    set((state) => {
      const idx = findItemIndex(state, producto.id)
      const items = [...state.itemsCarrito]
      if (idx >= 0) {
        items[idx] = {
          ...items[idx],
          cantidad: items[idx].cantidad + cantidad,
        }
      } else {
        items.push({
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio_venta,
          costo: producto.costo,
          cantidad,
        })
      }
      return { itemsCarrito: items }
    }),
  eliminarItem: (productoId) =>
    set((state) => ({
      itemsCarrito: state.itemsCarrito.filter((i) => i.producto_id !== productoId),
    })),
  cambiarCantidad: (productoId, cantidad) =>
    set((state) => ({
      itemsCarrito: state.itemsCarrito.map((i) =>
        i.producto_id === productoId ? { ...i, cantidad } : i
      ),
    })),
  setDescuentoGlobal: (porcentaje) => set({ descuentoGlobal: porcentaje }),
  setPagos: (pagos) => set({ pagos }),
  setTicketActual: (ticket) => set({ ticketActual: ticket }),
  limpiarVenta: () => set({
    itemsCarrito: [],
    pagos: [],
    descuentoGlobal: 0,
    ticketActual: null,
  }),
  setEstadoCarga: (estado) => set({ estadoCarga: estado }),
  setError: (error) => set({ error }),
}))
