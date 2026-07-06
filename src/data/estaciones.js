import { LINE_COLORS } from './scanners'

export { LINE_COLORS }

export const conexiones = [
  { from: 'V-01', to: 'V-02', linea: 'rtk' },
  { from: 'V-02', to: 'V-03', linea: 'rtk' },
  { from: 'V-03', to: 'V-04', linea: 'rtk' },
  { from: 'V-04', to: 'V-05', linea: 'rtk' },
  { from: 'V-05', to: 'V-06', linea: 'rtk' },
  { from: 'V-06', to: 'T-01', linea: 'rtk' },
  { from: 'A-01', to: 'A-02', linea: 'slam' },
  { from: 'A-02', to: 'A-03', linea: 'slam' },
  { from: 'A-03', to: 'A-04', linea: 'slam' },
  { from: 'A-04', to: 'A-05', linea: 'slam' },
  { from: 'A-05', to: 'T-01', linea: 'slam' },
  { from: 'T-01', to: 'N-01', linea: 'satlidar' },
  { from: 'N-01', to: 'N-02', linea: 'satlidar' },
  { from: 'N-02', to: 'T-02', linea: 'satlidar' },
  { from: 'T-01', to: 'M-01', linea: 'cloudcompare' },
  { from: 'M-01', to: 'M-02', linea: 'cloudcompare' },
  { from: 'M-02', to: 'M-03', linea: 'cloudcompare' },
  { from: 'M-03', to: 'T-02', linea: 'cloudcompare' },
  { from: 'T-02', to: 'R-01', linea: 'shared' },
]

export const posDesktop = {
  'V-01': { x: 60, y: 100 },
  'V-02': { x: 180, y: 100 },
  'V-03': { x: 300, y: 100 },
  'V-04': { x: 420, y: 100 },
  'V-05': { x: 540, y: 100 },
  'V-06': { x: 660, y: 100 },
  'A-01': { x: 60, y: 200 },
  'A-02': { x: 180, y: 200 },
  'A-03': { x: 300, y: 200 },
  'A-04': { x: 420, y: 200 },
  'A-05': { x: 540, y: 200 },
  'T-01': { x: 820, y: 150 },
  'N-01': { x: 920, y: 280 },
  'N-02': { x: 1020, y: 380 },
  'M-01': { x: 720, y: 280 },
  'M-02': { x: 780, y: 380 },
  'M-03': { x: 880, y: 460 },
  'T-02': { x: 980, y: 520 },
  'R-01': { x: 980, y: 650 },
}

export const posMobile = {
  'V-01': { x: 100, y: 50 },
  'V-02': { x: 100, y: 110 },
  'V-03': { x: 100, y: 170 },
  'V-04': { x: 100, y: 230 },
  'V-05': { x: 100, y: 290 },
  'V-06': { x: 100, y: 350 },
  'A-01': { x: 300, y: 50 },
  'A-02': { x: 300, y: 110 },
  'A-03': { x: 300, y: 170 },
  'A-04': { x: 300, y: 230 },
  'A-05': { x: 300, y: 290 },
  'T-01': { x: 200, y: 430 },
  'N-01': { x: 320, y: 530 },
  'N-02': { x: 320, y: 590 },
  'M-01': { x: 80, y: 530 },
  'M-02': { x: 80, y: 590 },
  'M-03': { x: 80, y: 650 },
  'T-02': { x: 200, y: 730 },
  'R-01': { x: 200, y: 810 },
}

export const VIEWBOX = { width: 1100, height: 720 }
export const VIEWBOX_MOBILE = { width: 400, height: 880 }

export function getPositions(mobile) {
  return mobile ? posMobile : posDesktop
}

export function getViewBox(mobile) {
  return mobile ? VIEWBOX_MOBILE : VIEWBOX
}

export function getPathD(from, to, mobile = false) {
  const positions = getPositions(mobile)
  const a = positions[from]
  const b = positions[to]
  if (!a || !b) return ''
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2

  if (Math.abs(a.y - b.y) < 8) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
  }
  if (Math.abs(a.x - b.x) < 8) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
  }
  if (mobile) {
    return `M ${a.x} ${a.y} L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${b.y}`
  }
  return `M ${a.x} ${a.y} L ${mx} ${a.y} L ${mx} ${b.y} L ${b.x} ${b.y}`
}

export const estaciones = [
  {
    codigo: 'V-01',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: 'Preparación',
    resumen: 'Batería, memoria y Hi-Survey listos antes de salir.',
    cuerpo: 'Cargá la batería la noche anterior (carga completa en ~2 h con el adaptador del kit), verificá que la barra de batería esté bien trabada y conectá Hi-Survey al SL9 por Wi-Fi (recomendado), Bluetooth o NFC. La contraseña Wi-Fi por defecto del equipo es 12345678. Si van a hacer un recorrido que mezcla exterior e interior, empezá siempre desde afuera con FIX confirmado: el equipo cambia a SLAM automáticamente al perder satélites y todo queda alineado.',
    tip: '💡 Llevá batería externa de repuesto: en modo SLAM el consumo sube.',
    errorNovato: 'Salir con la batería al 40% pensando que "alcanza" — en SLAM se apaga a mitad del recorrido.',
    tiempo: '5 min',
    imagen: '/img/bateria-instalacion.jpg',
    imagenAlt: 'Instalación de la barra de batería del SL9 (manual SatLab)',
    demo: null,
    posicion: posDesktop['V-01'],
  },
  {
    codigo: 'V-02',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: 'Conectar NTRIP',
    resumen: 'Correcciones RTK por internet o radio UHF.',
    cuerpo: 'En Hi-Survey abrí [Conectar dispositivo] y elegí Wi-Fi (recomendado), Bluetooth o NFC. Para correcciones RTK configurá NTRIP/CORS (usuario + mountpoint) o radio UHF con base propia — el canal y protocolo deben coincidir entre base y rover. La luz de señal parpadea en verde cuando llega RTCM.',
    tip: '💡 Tené las credenciales NTRIP anotadas antes de llegar al sitio — sin señal de datos no hay correcciones.',
    errorNovato: 'Olvidar activar los datos móviles de la SIM del equipo.',
    tiempo: '3–10 min',
    imagen: '/img/hi-survey-wifi.jpg',
    imagenAlt: 'Hi-Survey: conexión Wi-Fi al SL9 (manual SatLab)',
    demo: null,
    posicion: posDesktop['V-02'],
  },
  {
    codigo: 'V-03',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: 'FIX logrado',
    resumen: 'Luz de precisión verde = listo. Rojo o amarillo = esperá.',
    cuerpo: 'Esperá luz de precisión verde (error <5 cm). Amarillo indica 6–10 cm; rojo, más de 10 cm — no escanees georreferenciado todavía. La luz de modo verde confirma RTK; la de señal parpadea en verde cuando llegan correcciones RTCM.',
    tip: '💡 FIJO = centímetros. FLOTANTE = todavía no; no empieces el escaneo georreferenciado.',
    errorNovato: 'Escanear con luz de precisión roja o amarilla = nube imprecisa o desplazada.',
    tiempo: '1–5 min',
    imagen: '/img/campo-escaneo.jpg',
    imagenAlt: 'Operador escaneando ladera al aire libre con el SL9',
    demo: null,
    posicion: posDesktop['V-03'],
  },
  {
    codigo: 'V-04',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: 'Escaneo exterior',
    resumen: 'Caminá constante, con traslape, sin giros bruscos.',
    cuerpo: 'En Hi-Survey elegí SLAM-RTK, completá la inicialización y arrancá el escaneo al aire libre con precisión verde. Caminá estable, sin giros bruscos ni sacudidas; abrí puertas antes de entrar y evitá ascensores. En pasillos, incliná el equipo hacia adelante para alinear el láser con el fondo. Esperá 1–2 s tras detenerte antes de marcar puntos.',
    tip: '💡 Si pasás bajo techos o puentes, el equipo cambia a SLAM automáticamente sin perder la alineación.',
    errorNovato: 'Girar en U brusco, subir en ascensor o bloquear cámara/láser = fallo de mapeo o deriva.',
    tiempo: 'Depende del sitio: ~10 min por 500 m²',
    imagen: '/img/slam-rtk-modo.jpg',
    imagenAlt: 'Modo SLAM-RTK en Hi-Survey (manual SatLab)',
    demo: 'ScanDemo',
    posicion: posDesktop['V-04'],
  },
  {
    codigo: 'V-05',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: 'Revisión en sitio',
    resumen: 'Mapa de calor de precisión antes de irse.',
    cuerpo: 'Detené el escaneo y revisá la nube en pantalla con el mapa de calor de precisión. ¿Zonas con huecos o color de baja calidad? Re-escanealas ANTES de desarmar el equipo y salir del sitio.',
    tip: '💡 Es más barato re-escanear en sitio que volver otro día.',
    errorNovato: 'Guardar y salir sin revisar — los huecos solo se ven en oficina cuando ya es tarde.',
    tiempo: '5–15 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['V-05'],
  },
  {
    codigo: 'V-06',
    linea: 'rtk',
    tipo: 'estacion',
    nombre: '→ Entrega de nube',
    resumen: 'La nube viaja en coordenadas reales (NEZ/BLH) hacia Extracción.',
    cuerpo: 'Exportá la nube georreferenciada en coordenadas unificadas (NEZ o BLH, ej. CRTM05 para Costa Rica). Pasala a la computadora — el siguiente paso es bajar el archivo del equipo.',
    tip: '💡 Anotá el sistema de coordenadas usado en Hi-Survey para no mezclar proyectos.',
    errorNovato: 'Exportar sin verificar el sistema de coordenadas del proyecto.',
    tiempo: '5 min',
    imagen: '/img/modo-vara.jpg',
    imagenAlt: 'Modo vara de centrado RTK con el SL9',
    demo: null,
    posicion: posDesktop['V-06'],
    resumenTramo: [
      'Preparar equipo y Hi-Survey',
      'Conectar NTRIP y lograr FIX',
      'Escanear exterior con traslape',
      'Revisar mapa de calor en sitio',
      'Exportar en coordenadas reales → T-01',
    ],
  },
  {
    codigo: 'A-01',
    linea: 'slam',
    tipo: 'estacion',
    nombre: 'Preparación',
    resumen: 'Igual que V-01, con ojo en la batería SLAM.',
    cuerpo: 'Batería cargada, memoria libre, Hi-Survey conectado. En modo SLAM la batería interna dura ~2 h; con externa, hasta ~5 h. El SL9 permite cambio en caliente — llevá repuesto.',
    tip: '💡 No necesitás configurar NTRIP ni esperar FIX en este flujo.',
    errorNovato: 'Intentar configurar RTK adentro de un edificio — no hay satélites, solo perdés tiempo.',
    tiempo: '5 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['A-01'],
  },
  {
    codigo: 'A-02',
    linea: 'slam',
    tipo: 'estacion',
    nombre: 'Punto cero',
    resumen: 'Esquina o puerta reconocible = origen local.',
    cuerpo: 'Empezá el escaneo en un lugar reconocible (esquina, puerta). Ese punto será el (0,0,0) de tus coordenadas locales. Para arquitectos: marcá 2–3 puntos físicos medibles después por si querés georreferenciar con RTK.',
    tip: '💡 Una cinta en el piso en la puerta de entrada ayuda a orientarse en Rhino.',
    errorNovato: 'Empezar en medio de un pasillo sin referencia — después no sabés dónde quedó el origen.',
    tiempo: '2 min',
    imagen: '/img/modo-portatil.jpg',
    imagenAlt: 'Operador escaneando en modo portátil de mano',
    demo: null,
    posicion: posDesktop['A-02'],
  },
  {
    codigo: 'A-03',
    linea: 'slam',
    tipo: 'estacion',
    nombre: 'Escaneo en bucle',
    resumen: 'Paso constante, dos pasadas por conectores, cuidado con vidrios.',
    cuerpo: 'Recorré cada habitación a paso constante y estable. En interiores grandes, cerrá el bucle cerca del inicio y pasá dos veces por conectores. No encares el LiDAR a la pared en esquinas; abrí puertas antes de entrar; quien te acompañe va detrás tuyo, no al costado. Vidrios y superficies negras generan fantasmas que se limpian después.',
    tip: '💡 Si la batería llega al 5 %, el equipo guarda y termina la tarea automáticamente. ¡Revisá el nivel antes de entrar a zonas largas!',
    errorNovato: 'Escanear un pasillo de vidrio sin plan = mitad de la nube son fantasmas afuera del edificio.',
    tiempo: 'Depende del sitio: ~10 min por 500 m²',
    imagen: '/img/medicion-imagen.jpg',
    imagenAlt: 'Medición por imagen con el SL9',
    demo: null,
    posicion: posDesktop['A-03'],
  },
  {
    codigo: 'A-04',
    linea: 'slam',
    tipo: 'estacion',
    nombre: 'Cierre',
    resumen: 'Detener, revisar nube en pantalla.',
    cuerpo: 'Detené el escaneo y revisá la nube en Hi-Survey. Verificá que no haya huecos grandes ni zonas sin datos antes de exportar.',
    tip: '💡 Girá la vista 3D en la app para ver techos y rincones.',
    errorNovato: 'Asumir que "se ve bien en el mapa 2D" sin revisar en 3D.',
    tiempo: '5 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['A-04'],
  },
  {
    codigo: 'A-05',
    linea: 'slam',
    tipo: 'estacion',
    nombre: '→ Entrega de nube',
    resumen: 'La nube pasa en metros desde tu punto cero hacia Extracción.',
    cuerpo: 'Exportá la nube en coordenadas locales (metros desde el punto de arranque). Perfecta para modelar geometría en Rhino — vos decidís dónde ubicarla en el mundo.',
    tip: '💡 Guardá una captura del punto cero en la app para referencia.',
    errorNovato: 'Confundir coordenadas locales con "mal escaneado" — es el comportamiento esperado.',
    tiempo: '5 min',
    imagen: null,
    demo: 'CoordinateDemo',
    posicion: posDesktop['A-05'],
    resumenTramo: [
      'Preparar equipo (sin NTRIP)',
      'Elegir punto cero memorable',
      'Escanear en bucle con traslape',
      'Revisar nube en Hi-Survey',
      'Exportar coordenadas locales → T-01',
    ],
  },
  {
    codigo: 'T-01',
    linea: 'transbordo',
    tipo: 'transbordo',
    nombre: 'Extracción',
    resumen: 'Convergencia: bajar la nube cruda y elegir ruta de procesamiento.',
    cuerpo: 'Acá convergen los dos flujos de campo. Pasá la nube cruda a la computadora: conectá el SL9 por USB con el equipo apagado (aparece como disco externo), por Wi-Fi desde Hi-Survey, o copiá el proyecto desde la tarjeta. Después elegís: ¿procesás con Sat-LiDAR o con CloudCompare (gratis)?',
    tip: '💡 Para el curso recomendamos CloudCompare: aprendés el pipeline completo con herramientas libres.',
    errorNovato: 'Perder el archivo original crudo — siempre guardá una copia antes de procesar.',
    tiempo: '5–10 min',
    imagen: '/img/usb-descarga.jpg',
    imagenAlt: 'Descarga de datos por USB según manual SatLab',
    demo: null,
    posicion: posDesktop['T-01'],
    comparativa: [
      { aspecto: 'Costo', satlidar: 'Licencia del equipo', cloudcompare: 'Gratis y open source ✅' },
      { aspecto: 'Fortaleza', satlidar: 'Optimización de trayectoria, <1 cm, secciones automáticas', cloudcompare: 'Limpieza, submuestreo, alineación, formatos universales' },
      { aspecto: '¿Cuándo?', satlidar: 'Proyectos con máxima precisión o entregables topográficos', cloudcompare: 'Ruta recomendada para el curso de arquitectura' },
      { aspecto: 'Nota', satlidar: 'Ambas rutas pueden combinarse', cloudcompare: 'Procesar en Sat-LiDAR y refinar en CloudCompare' },
    ],
  },
  {
    codigo: 'N-01',
    linea: 'satlidar',
    tipo: 'estacion',
    nombre: 'Procesar en Sat-LiDAR',
    resumen: 'Optimizar trayectoria SLAM y limpiar ruido.',
    cuerpo: 'Abrí el proyecto en Sat-LiDAR. El software optimiza la trayectoria SLAM: nube final <2 cm de grosor y <1 cm de precisión. Recortá ruido (carros, personas, fantasmas de vidrio) y reducí densidad si la nube es gigante.',
    tip: '💡 Exportá secciones y planos automáticos si el proyecto lo pide.',
    errorNovato: 'Procesar sin revisar la trayectoria — un loop mal cerrado se nota después.',
    tiempo: '15–60 min',
    imagen: '/img/software-satlidar.jpg',
    imagenAlt: 'Interfaz de Sat-LiDAR con túnel y secciones',
    demo: null,
    posicion: posDesktop['N-01'],
  },
  {
    codigo: 'N-02',
    linea: 'satlidar',
    tipo: 'estacion',
    nombre: 'Exportar',
    resumen: 'E57 / LAS / PTS / XYZ hacia T-02.',
    cuerpo: 'Exportá en E57 (conserva color), LAS/LAZ, PTS o XYZ. Si la nube tiene coordenadas globales enormes (RTK), trasladá a un origen local antes de exportar.',
    tip: '💡 E57 es el formato más cómodo para Rhino con color.',
    errorNovato: 'Exportar 200 millones de puntos sin reducir — Rhino se congela.',
    tiempo: '5–15 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['N-02'],
    resumenTramo: [
      'Importar nube cruda en Sat-LiDAR',
      'Optimizar trayectoria y limpiar',
      'Exportar E57/PTS → T-02',
    ],
  },
  {
    codigo: 'M-01',
    linea: 'cloudcompare',
    tipo: 'estacion',
    nombre: 'Importar',
    resumen: 'Abrir nube en CloudCompare; shift to local origin si aplica.',
    cuerpo: 'Abrí la nube exportada del equipo (LAS, E57, PLY). Si viene con coordenadas globales enormes, CloudCompare ofrece "Shift to local origin" al importar — ACEPTÁ y ANOTÁ el desplazamiento para poder volver a coordenadas reales después.',
    tip: '💡 Guardá el archivo .txt del shift — lo vas a necesitar si unís con otros datos.',
    errorNovato: 'Rechazar el shift y trabajar con números de millones — Rhino tiembla al hacer zoom.',
    tiempo: '5 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['M-01'],
  },
  {
    codigo: 'M-02',
    linea: 'cloudcompare',
    tipo: 'estacion',
    nombre: 'Limpiar',
    resumen: 'Segmentar ruido y aplicar filtro SOR.',
    cuerpo: 'Usá la herramienta de segmento (tijeras) para borrar carros, personas, puntos fantasma de vidrios y cielo. Aplicá filtro SOR (Statistical Outlier Removal) para eliminar ruido disperso.',
    tip: '💡 Segmentá por capas: primero lo grande (carros), después el ruido fino (SOR).',
    errorNovato: 'Borrar demasiado cerca de la fachada — perdés detalle arquitectónico.',
    tiempo: '10–30 min',
    imagen: null,
    demo: 'CloudCleanDemo',
    posicion: posDesktop['M-02'],
  },
  {
    codigo: 'M-03',
    linea: 'cloudcompare',
    tipo: 'estacion',
    nombre: 'Submuestrear',
    resumen: 'Reducir densidad para que Rhino pueda trabajar.',
    cuerpo: 'Usá "Subsample" espacial a 5–10 mm para modelado arquitectónico. Rhino vuela con 5–20 millones de puntos; sufre con 200 millones. Regla del curso: más puntos ≠ mejor modelo.',
    tip: '💡 3,000–10,000 puntos por m² suele bastar para dibujar plantas y secciones.',
    errorNovato: 'Llevar 200 M de puntos a Rhino = computadora congelada en crítica.',
    tiempo: '5 min',
    imagen: null,
    demo: 'CloudCleanDemo',
    posicion: posDesktop['M-03'],
    resumenTramo: [
      'Importar y shift to local origin',
      'Segmentar y filtrar SOR',
      'Submuestrear a 5–10 mm → T-02',
    ],
  },
  {
    codigo: 'T-02',
    linea: 'transbordo',
    tipo: 'transbordo',
    nombre: 'Formato de intercambio',
    resumen: 'Re-convergencia: archivo limpio listo para Rhino.',
    cuerpo: 'Los dos flujos de oficina (Sat-LiDAR y CloudCompare) se juntan acá. El resultado es un archivo limpio en formato de intercambio estándar, listo para modelar.',
    tip: '💡 Verificá el tamaño del archivo antes de importar a Rhino.',
    errorNovato: 'Exportar en un formato que Rhino no abre nativamente sin convertir.',
    tiempo: '2 min',
    imagen: null,
    demo: null,
    posicion: posDesktop['T-02'],
    formatos: [
      { nombre: 'E57', desc: 'Moderno, conserva color. Recomendado.' },
      { nombre: 'PTS / XYZ', desc: 'Texto universal, pero pesado.' },
      { nombre: 'LAS / LAZ', desc: 'Estándar LiDAR; en Rhino puede requerir conversión previa.' },
    ],
  },
  {
    codigo: 'R-01',
    linea: 'shared',
    tipo: 'terminal',
    nombre: 'Rhino',
    resumen: 'Paso final: importar, verificar, seccionar y modelar.',
    cuerpo: 'Importá la nube en Rhino 7/8 con Archivo → Importar (E57, PTS, XYZ entran como PointCloud). Verificá que el documento esté en metros y comprobá un vano de puerta con Distance. Usá ClippingPlane para rebanar plantas y cortes — el momento "¡ajá!" del estudiante de arquitectura. Modelá encima con snap a puntos; ShrinkWrap (Rhino 8) o Grasshopper (Cockroach, Volvox) para mallas.',
    tip: '💡 Si la geometría "tiembla" al hacer zoom, probablemente no trasladaste el origen.',
    errorNovato: 'Modelar sin verificar unidades — todo queda a escala 1:1000.',
    tiempo: 'Variable (horas de modelado)',
    imagen: '/img/volumen-coordenadas.jpg',
    imagenAlt: 'Cálculo de volumen y sistema de coordenadas',
    demo: null,
    posicion: posDesktop['R-01'],
    pasos: [
      { titulo: 'Importar', texto: 'Archivo → Importar E57/PTS/XYZ. LAS pesados: convertir antes en CloudCompare.' },
      { titulo: 'Verificar', texto: 'Documento en metros; comprobar medida conocida con Distance.' },
      { titulo: 'Seccionar', texto: 'ClippingPlane para plantas y cortes — la nube se convierte en dibujo.' },
      { titulo: 'Modelar', texto: 'Snap a puntos, curvas y superficies encima; ShrinkWrap o Grasshopper para mallas.' },
    ],
  },
]

export const conceptosBasicos = [
  {
    tag: 'GNSS / RTK',
    tagClass: 'g',
    title: 'El "dónde estoy" exacto',
    body: 'Satélites GPS/Galileo/GLONASS/BeiDou dan posición con error de centímetros. Ideal al aire libre.',
  },
  {
    tag: 'SLAM',
    tagClass: 'b',
    title: 'Los "ojos" del escáner',
    body: 'El láser mide todo alrededor mientras caminás (200,000 pts/seg, hasta 70 m). No necesita satélites.',
  },
  {
    tag: 'SLAM-Fix',
    tagClass: 'o',
    title: 'El truco del SL9',
    body: 'Si pierde satélite (techos, puentes, bosque) cambia a SLAM automáticamente. La nube sale en coordenadas reales.',
  },
]

export function getEstacionByCodigo(codigo) {
  return estaciones.find((e) => e.codigo === codigo)
}

export function getEstacionIndex(codigo) {
  return estaciones.findIndex((e) => e.codigo === codigo)
}

const LINE_PRIORITY = ['rtk', 'slam', 'satlidar', 'cloudcompare', 'shared', 'transbordo']

function pickConnection(list, linea) {
  if (!list.length) return null
  const sameLine = list.find((c) => c.linea === linea)
  if (sameLine) return sameLine
  return [...list].sort(
    (a, b) => LINE_PRIORITY.indexOf(a.linea) - LINE_PRIORITY.indexOf(b.linea),
  )[0]
}

export function getStationContext(codigo, activeConnections) {
  const est = getEstacionByCodigo(codigo)
  const incoming = activeConnections.filter((c) => c.to === codigo)
  const outgoing = activeConnections.filter((c) => c.from === codigo)
  const inConn = pickConnection(incoming, est?.linea)
  const outConn = pickConnection(outgoing, est?.linea)
  const prev = inConn?.from ?? null
  const next = outConn?.to ?? null
  const codes = [prev, codigo, next].filter(Boolean)
  const segmentConnections = activeConnections.filter(
    (c) => codes.includes(c.from) && codes.includes(c.to),
  )

  return { prev, next, codes, segmentConnections }
}

export function getContextViewBox(codes, mobile = false, padding = 72) {
  const positions = getPositions(mobile)
  const pts = codes.map((c) => positions[c]).filter(Boolean)
  if (!pts.length) return { ...getViewBox(mobile), x: 0, y: 0 }

  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const minX = Math.min(...xs) - padding
  const minY = Math.min(...ys) - padding
  const maxX = Math.max(...xs) + padding
  const maxY = Math.max(...ys) + padding

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
