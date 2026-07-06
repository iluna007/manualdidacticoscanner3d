export const scanners = {
  sl9: {
    id: 'sl9',
    nombre: 'SatLab SL9 SLAM RTK',
    tipo: 'SLAM portátil + RTK',
    lineas: ['rtk', 'slam'],
    softwareCampo: 'Satsurv',
    softwareOficina: 'Sat-LiDAR',
    specs: {
      alcance: '70 m',
      tasa: '200,000 pts/s',
      precision: '<3 cm campo · <1 cm procesada',
      bateria: '2 h interna / 5 h externa (SLAM)',
    },
    imagenes: {
      hero: '/img/hero-sl9.jpg',
      detalle: '/img/equipo-detalle.jpg',
      campo: '/img/campo-escaneo.jpg',
      puente: '/img/slam-fix-puente.jpg',
      portatil: '/img/modo-portatil.jpg',
      vara: '/img/modo-vara.jpg',
      satsurv: '/img/software-satsurv.jpg',
      satlidar: '/img/software-satlidar.jpg',
      volumen: '/img/volumen-coordenadas.jpg',
      aplicaciones: '/img/aplicaciones.jpg',
      medicion: '/img/medicion-imagen.jpg',
    },
  },
}

/** Paleta monocromática — cada línea usa un gris distinto para legibilidad */
export const LINE_COLORS = {
  rtk: '#1a1a1a',
  slam: '#3d3d3d',
  satlidar: '#5c5c5c',
  cloudcompare: '#7a7a7a',
  shared: '#4a4a4a',
  transbordo: '#0d0d0d',
}

export const LINE_LABELS = {
  rtk: 'Línea A · RTK (campo)',
  slam: 'Línea B · SLAM (campo)',
  satlidar: 'Línea C · Sat-LiDAR (oficina)',
  cloudcompare: 'Línea D · CloudCompare (oficina)',
  shared: 'Andén · Rhino',
  transbordo: 'Transbordo ◉',
}

export const LINE_DASH = {
  rtk: null,
  slam: '20 12',
  satlidar: '8 8 24 8',
  cloudcompare: '3 10',
  shared: '32 10',
  transbordo: null,
}

export const LINE_WEIGHT = {
  rtk: 1.05,
  slam: 1,
  satlidar: 0.95,
  cloudcompare: 0.88,
  shared: 1.2,
  transbordo: 1,
}
