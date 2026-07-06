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

export const LINE_COLORS = {
  rtk: '#3E7C4F',
  slam: '#2E5E8C',
  satlidar: '#E8641B',
  cloudcompare: '#7B4B94',
  shared: '#8A8578',
  transbordo: '#26221C',
}

export const LINE_LABELS = {
  rtk: 'Línea Verde · RTK',
  slam: 'Línea Azul · SLAM',
  satlidar: 'Línea Naranja · Sat-LiDAR',
  cloudcompare: 'Línea Morada · CloudCompare',
  shared: 'Andén compartido',
  transbordo: 'Transbordo',
}
