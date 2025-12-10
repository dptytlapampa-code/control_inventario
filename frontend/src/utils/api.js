const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

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

const clone = (data) => JSON.parse(JSON.stringify(data))

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`

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
