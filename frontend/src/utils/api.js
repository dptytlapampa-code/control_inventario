import axios from 'axios'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const API_BASE_URL = import.meta.env.VITE_API_URL

let hospitales = [
  { id: 'h1', nombre: 'Hospital Central', direccion: 'Av. Principal 123', telefono: '555-1234', email: 'contacto@hospitalcentral.com' },
  { id: 'h2', nombre: 'Sanatorio Norte', direccion: 'Calle Salud 456', telefono: '555-5678', email: 'info@sanatorionorte.com' },
]

let servicios = [
  { id: 's1', hospitalId: 'h1', nombre: 'Emergencias', responsable: 'Dra. Pérez' },
  { id: 's2', hospitalId: 'h1', nombre: 'Terapia Intensiva', responsable: 'Dr. Gómez' },
  { id: 's3', hospitalId: 'h2', nombre: 'Pediatría', responsable: 'Dra. Rivas' },
]

let oficinas = [
  { id: 'o1', hospitalId: 'h1', servicioId: 's1', nombre: 'Box 1', extension: '101' },
  { id: 'o2', hospitalId: 'h1', servicioId: 's2', nombre: 'Sala 3', extension: '202' },
  { id: 'o3', hospitalId: 'h2', servicioId: 's3', nombre: 'Consultorio A', extension: '303' },
]

let tiposEquipos = [
  { id: 't1', nombre: 'Monitor', descripcion: 'Pantallas de visualización', icono: 'Monitor', estado: 'Activo' },
  { id: 't2', nombre: 'Servidor', descripcion: 'Equipamiento de backend', icono: 'Router', estado: 'Activo' },
]

let equipos = [
  {
    id: 'eq1',
    nombre: 'Monitor Philips',
    tipoId: 't1',
    serie: 'SN-100',
    bienPatrimonial: 'BP-001',
    estado: 'Operativo',
    hospitalId: 'h1',
    servicioId: 's1',
    oficinaId: 'o1',
  },
  {
    id: 'eq2',
    nombre: 'Servidor Lenovo',
    tipoId: 't2',
    serie: 'SN-200',
    bienPatrimonial: 'BP-002',
    estado: 'En mantenimiento',
    hospitalId: 'h2',
    servicioId: 's3',
    oficinaId: 'o3',
  },
]

let mantenimientos = [
  {
    id: 'm1',
    equipoId: 'eq1',
    fecha: '2024-05-01',
    tipo: 'Preventivo',
    responsable: 'Téc. López',
    notas: 'Chequeo general',
    hospitalId: 'h1',
    servicioId: 's1',
    oficinaId: 'o1',
  },
]

let adjuntos = []
let historiales = [
  {
    id: 'h1',
    equipoId: 'eq1',
    tipoEvento: 'Mantenimiento preventivo',
    descripcion: 'Limpieza general y revisión de sensores.',
    fechaEvento: '2024-05-12T10:30',
    usuarioRegistra: 'superadmin',
    oficinaOrigenId: 'o1',
    oficinaDestinoId: 'o2',
  },
  {
    id: 'h2',
    equipoId: 'eq1',
    tipoEvento: 'Cambio de estado',
    descripcion: 'Marcado como operativo luego de pruebas.',
    fechaEvento: '2024-06-01T09:00',
    usuarioRegistra: 'superadmin',
    oficinaOrigenId: 'o2',
    oficinaDestinoId: '',
  },
]

let usuarios = [
  {
    id: 'user-001',
    nombre: 'Ana SuperAdmin',
    email: 'ana.superadmin@example.com',
    roles: ['superadmin', 'gestor'],
  },
  {
    id: 'user-002',
    nombre: 'Bruno Operaciones',
    email: 'bruno.ops@example.com',
    roles: ['operador'],
  },
  {
    id: 'user-003',
    nombre: 'Carla Auditoría',
    email: 'carla.audit@example.com',
    roles: ['auditor'],
  },
]

let usuarioPermisos = [
  {
    id: 'perm-001',
    user_id: 'user-001',
    hospital_id: null,
    modulo: 'Hospitales',
    puede_ver: true,
    puede_crear: true,
    puede_editar: true,
    puede_eliminar: true,
  },
  {
    id: 'perm-002',
    user_id: 'user-001',
    hospital_id: 'h1',
    modulo: 'Equipos',
    puede_ver: true,
    puede_crear: true,
    puede_editar: true,
    puede_eliminar: false,
  },
]

const clone = (data) => JSON.parse(JSON.stringify(data))

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`

const buildAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchDashboardResource = async (path) => {
  if (!API_BASE_URL) return null
  const response = await axios.get(`${API_BASE_URL}${path}`, { headers: buildAuthHeaders() })
  return response.data
}

export async function getHospitales() {
  await delay()
  return clone(hospitales)
}

export async function createHospital(data) {
  await delay()
  const nuevo = { id: generateId('h'), ...data }
  hospitales = [...hospitales, nuevo]
  return clone(nuevo)
}

export async function updateHospital(id, data) {
  await delay()
  hospitales = hospitales.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(hospitales.find((item) => item.id === id))
}

export async function deleteHospital(id) {
  await delay()
  hospitales = hospitales.filter((item) => item.id !== id)
  servicios = servicios.filter((item) => item.hospitalId !== id)
  oficinas = oficinas.filter((item) => item.hospitalId !== id)
  return true
}

export async function getServicios() {
  await delay()
  return clone(servicios)
}

export async function createServicio(data) {
  await delay()
  const nuevo = { id: generateId('s'), ...data }
  servicios = [...servicios, nuevo]
  return clone(nuevo)
}

export async function updateServicio(id, data) {
  await delay()
  servicios = servicios.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(servicios.find((item) => item.id === id))
}

export async function deleteServicio(id) {
  await delay()
  servicios = servicios.filter((item) => item.id !== id)
  oficinas = oficinas.filter((item) => item.servicioId !== id)
  return true
}

export async function getOficinas() {
  await delay()
  return clone(oficinas)
}

export async function createOficina(data) {
  await delay()
  const nueva = { id: generateId('o'), ...data }
  oficinas = [...oficinas, nueva]
  return clone(nueva)
}

export async function updateOficina(id, data) {
  await delay()
  oficinas = oficinas.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(oficinas.find((item) => item.id === id))
}

export async function deleteOficina(id) {
  await delay()
  oficinas = oficinas.filter((item) => item.id !== id)
  return true
}

export async function getTiposEquipos() {
  await delay()
  return clone(tiposEquipos)
}

export async function createTipoEquipo(data) {
  await delay()
  const nuevo = { id: generateId('t'), ...data }
  tiposEquipos = [...tiposEquipos, nuevo]
  return clone(nuevo)
}

export async function updateTipoEquipo(id, data) {
  await delay()
  tiposEquipos = tiposEquipos.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(tiposEquipos.find((item) => item.id === id))
}

export async function deleteTipoEquipo(id) {
  await delay()
  tiposEquipos = tiposEquipos.filter((item) => item.id !== id)
  return true
}

export async function getEquipos() {
  await delay()
  return clone(equipos)
}

export async function createEquipo(data) {
  await delay()
  const nuevo = { id: generateId('eq'), ...data }
  equipos = [...equipos, nuevo]
  return clone(nuevo)
}

export async function updateEquipo(id, data) {
  await delay()
  equipos = equipos.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(equipos.find((item) => item.id === id))
}

export async function deleteEquipo(id) {
  await delay()
  equipos = equipos.filter((item) => item.id !== id)
  return true
}

export async function getMantenimientos() {
  await delay()
  return clone(mantenimientos)
}

export async function createMantenimiento(data) {
  await delay()
  const nuevo = { id: generateId('m'), ...data }
  mantenimientos = [...mantenimientos, nuevo]
  return clone(nuevo)
}

export async function updateMantenimiento(id, data) {
  await delay()
  mantenimientos = mantenimientos.map((item) => (item.id === id ? { ...item, ...data } : item))
  return clone(mantenimientos.find((item) => item.id === id))
}

export async function deleteMantenimiento(id) {
  await delay()
  mantenimientos = mantenimientos.filter((item) => item.id !== id)
  return true
}

export async function getHistorial(equipoId) {
  await delay()
  return historiales
    .filter((item) => item.equipoId === equipoId)
    .sort((a, b) => new Date(b.fechaEvento) - new Date(a.fechaEvento))
    .map((item) => ({ ...item }))
}

export async function createHistorial(equipoId, data) {
  await delay()
  const nuevo = {
    id: generateId('hist'),
    equipoId,
    tipoEvento: data.tipoEvento,
    descripcion: data.descripcion || '',
    fechaEvento: data.fechaEvento,
    usuarioRegistra: 'superadmin',
    oficinaOrigenId: data.oficinaOrigenId || '',
    oficinaDestinoId: data.oficinaDestinoId || '',
  }
  historiales = [nuevo, ...historiales]
  return { ...nuevo }
}

export async function updateHistorial(id, data) {
  await delay()
  historiales = historiales.map((item) =>
    item.id === id
      ? {
          ...item,
          tipoEvento: data.tipoEvento,
          descripcion: data.descripcion || '',
          fechaEvento: data.fechaEvento,
          oficinaOrigenId: data.oficinaOrigenId || '',
          oficinaDestinoId: data.oficinaDestinoId || '',
        }
      : item,
  )

  const updated = historiales.find((item) => item.id === id)
  return { ...updated }
}

export async function deleteHistorial(id) {
  await delay()
  historiales = historiales.filter((item) => item.id !== id)
  return true
}

export async function getUsuarios() {
  await delay()
  return clone(usuarios)
}

export async function getPermisosUsuario(userId) {
  await delay()
  return clone(usuarioPermisos.filter((permiso) => permiso.user_id === userId))
}

export async function savePermisosUsuario(userId, data) {
  await delay()
  const payload = Array.isArray(data?.permisos) ? data.permisos : data ? [data] : []

  payload.forEach((permiso) => {
    const targetHospital = permiso.hospital_id ?? null
    const existingIndex = usuarioPermisos.findIndex(
      (item) => item.user_id === userId && item.modulo === permiso.modulo && (item.hospital_id ?? null) === targetHospital,
    )

    const record = {
      id: existingIndex >= 0 ? usuarioPermisos[existingIndex].id : generateId('perm'),
      user_id: userId,
      hospital_id: targetHospital,
      modulo: permiso.modulo,
      puede_ver: Boolean(permiso.puede_ver),
      puede_crear: Boolean(permiso.puede_crear),
      puede_editar: Boolean(permiso.puede_editar),
      puede_eliminar: Boolean(permiso.puede_eliminar),
    }

    if (existingIndex >= 0) {
      usuarioPermisos[existingIndex] = record
    } else {
      usuarioPermisos = [...usuarioPermisos, record]
    }
  })

  return {
    user_id: userId,
    permisos: clone(usuarioPermisos.filter((permiso) => permiso.user_id === userId)),
  }
}

export async function deletePermiso(id) {
  await delay()
  usuarioPermisos = usuarioPermisos.filter((permiso) => permiso.id !== id)
  return true
}

export async function uploadAdjunto(equipoId, file) {
  await delay()

  if (!file) {
    throw new Error('No se ha seleccionado un archivo válido')
  }

  const nuevo = {
    id: generateId('adj'),
    equipoId,
    nombre: file.name,
    tipo: obtenerTipo(file.name),
    fecha: new Date().toLocaleDateString('es-ES'),
    size: file.size || 0,
    file,
    mime: file.type || 'application/octet-stream',
  }

  adjuntos = [nuevo, ...adjuntos]
  return { ...nuevo }
}

export async function getAdjuntos(equipoId) {
  await delay()
  return adjuntos.filter((item) => item.equipoId === equipoId).map((item) => ({ ...item }))
}

export async function deleteAdjunto(id) {
  await delay()
  adjuntos = adjuntos.filter((item) => item.id !== id)
  return true
}

export async function downloadAdjunto(id) {
  await delay()
  const adjunto = adjuntos.find((item) => item.id === id)

  if (!adjunto) {
    throw new Error('Adjunto no encontrado')
  }

  return {
    id: adjunto.id,
    nombre: adjunto.nombre,
    mime: adjunto.mime,
    file: adjunto.file,
  }
}

const normalizeEstados = (items) => {
  const estadoMap = {}
  items.forEach((item) => {
    estadoMap[item.estado?.toLowerCase() || 'desconocido'] = (estadoMap[item.estado?.toLowerCase() || 'desconocido'] || 0) + 1
  })
  return estadoMap
}

const mantenimientosPorMesMock = () => {
  const resumen = {}
  mantenimientos.forEach((item) => {
    if (!item.fecha) return
    const fecha = new Date(item.fecha)
    if (Number.isNaN(fecha.getTime())) return
    const label = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    resumen[label] = (resumen[label] || 0) + 1
  })
  return Object.entries(resumen)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([mes, total]) => ({ mes, total }))
}

export async function getDashboardKpis() {
  if (API_BASE_URL) {
    const data = await fetchDashboardResource('/dashboard/kpis')
    if (data) return data
  }

  await delay()
  const estadoMap = normalizeEstados(equipos)
  const hoy = new Date()
  const mantenimientosMes = mantenimientos.filter((item) => {
    const fecha = new Date(item.fecha)
    return !Number.isNaN(fecha.getTime()) &&
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth()
  }).length

  return {
    total_equipos: equipos.length,
    equipos_por_estado: estadoMap,
    mantenimientos_mes: mantenimientosMes,
    total_hospitales: hospitales.length,
    total_servicios: servicios.length,
    total_oficinas: oficinas.length,
  }
}

export async function getEquiposPorTipo() {
  if (API_BASE_URL) {
    const data = await fetchDashboardResource('/dashboard/equipos-por-tipo')
    if (data) return data
  }

  await delay()
  const resumen = {}
  equipos.forEach((item) => {
    const tipo = tiposEquipos.find((tipoEquipo) => tipoEquipo.id === item.tipoId)?.nombre || 'Sin tipo'
    resumen[tipo] = (resumen[tipo] || 0) + 1
  })

  return Object.entries(resumen).map(([tipo, total]) => ({ tipo, total }))
}

export async function getEquiposPorEstado() {
  if (API_BASE_URL) {
    const data = await fetchDashboardResource('/dashboard/equipos-por-estado')
    if (data) return data
  }

  await delay()
  const estadoMap = normalizeEstados(equipos)
  return Object.entries(estadoMap).map(([estado, total]) => ({ estado, total }))
}

export async function getMantenimientosPorMes() {
  if (API_BASE_URL) {
    const data = await fetchDashboardResource('/dashboard/mantenimientos-por-mes')
    if (data) return data
  }

  await delay()
  return mantenimientosPorMesMock()
}

export async function getEquiposPorHospital() {
  if (API_BASE_URL) {
    const data = await fetchDashboardResource('/dashboard/equipos-por-hospital')
    if (data) return data
  }

  await delay()
  const resumen = {}
  equipos.forEach((item) => {
    const hospital = hospitales.find((h) => h.id === item.hospitalId)?.nombre || 'Sin hospital'
    resumen[hospital] = (resumen[hospital] || 0) + 1
  })

  return Object.entries(resumen).map(([hospital, total]) => ({ hospital, total }))
}

function obtenerTipo(nombre) {
  const extension = nombre.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return 'PDF'
    case 'jpg':
    case 'jpeg':
      return 'JPG'
    case 'png':
      return 'PNG'
    default:
      return 'Archivo'
  }
}
