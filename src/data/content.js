export const navLinks = [
  { href: '#basico', label: 'Lo básico' },
  { href: '#decidir', label: '¿Con o sin RTK?' },
  { href: '#con-rtk', label: 'Flujo con RTK' },
  { href: '#sin-rtk', label: 'Flujo sin RTK' },
  { href: '#rhino', label: 'Rhino' },
  { href: '#glosario', label: 'Glosario' },
  { href: '#checklist', label: 'Checklist' },
]

export const hero = {
  eyebrow: 'GUÍA DE CAMPO · PARA DUMMIES',
  title: 'Del terreno a Rhino con el SL9 SLAM RTK',
  subtitle:
    'Todo lo que necesitas saber para escanear un sitio —con o sin señal satelital— y terminar con una nube de puntos lista para modelar en Rhino. Sin jerga innecesaria.',
  badges: [
    { label: 'RTK + SLAM', accent: true },
    { label: '200k pts/seg', accent: false },
    { label: 'hasta 70 m', accent: false },
    { label: 'Precisión <3 cm en campo · <1 cm procesada', accent: false },
  ],
}

export const basics = {
  kicker: '01 · Lo básico',
  title: '¿Qué hace este aparato, en palabras simples?',
  lead: 'El SL9 es dos instrumentos en uno: un GPS de precisión centimétrica (RTK) y un escáner láser que "ve" mientras caminas (SLAM). Tú caminas con él, y él dibuja el mundo en 3D como millones de puntitos: una nube de puntos.',
  cards: [
    {
      tag: 'GNSS / RTK',
      tagClass: 'g',
      title: 'El "dónde estoy" exacto',
      body: 'Usa satélites (GPS, Galileo, GLONASS, BeiDou) para saber su posición con error de centímetros. Funciona genial al aire libre con cielo despejado.',
    },
    {
      tag: 'SLAM',
      tagClass: 'b',
      title: 'Los "ojos" del escáner',
      body: 'El láser gira y mide todo a su alrededor mientras caminas (200,000 pts/seg, alcance hasta 70 m). No necesita satélites: se ubica comparando lo que ve, como tú te orientas dentro de tu casa a oscuras.',
    },
    {
      tag: 'SLAM-Fix',
      tagClass: 'o',
      title: 'El truco del SL9',
      body: 'Combina ambos automáticamente: si pierdes satélite (bajo un techo, un puente, un bosque), el SLAM toma el control sin que hagas nada. La nube sale con coordenadas reales sin puntos de control ni cerrar bucles.',
    },
  ],
  scanCaption:
    'Mueve la cámara: verde = con satélites (RTK), azul = sin satélites (SLAM)',
}

export const decision = {
  kicker: '02 · La gran pregunta',
  title: '¿Escaneo con RTK o sin RTK?',
  lead: 'Pregúntate una sola cosa: ¿necesito que mi modelo quede en coordenadas del mundo real (para topografía, unir con otros levantamientos o planos catastrales)? Si sí y estás al aire libre, usa RTK. Si solo necesitas la geometría, el modo sin RTK basta.',
  rule:
    '¿Necesito que el modelo quede en coordenadas del mundo real? → Con RTK (afuera). ¿Solo necesito la geometría? → Sin RTK basta.',
  branches: [
    {
      className: 'g',
      mono: 'Modo con RTK · Georreferenciado',
      title: 'Exteriores con cielo visible',
      image: '/img/modo-vara.jpg',
      imageAlt: 'Operador usando el SL9 en modo vara de centrado con RTK',
      items: [
        'Terrenos, calles, fachadas, movimientos de tierra',
        'La nube sale directo en coordenadas reales (NEZ/BLH)',
        'Se une perfecto con otros levantamientos y planos',
        'Precisión centimétrica en tiempo real',
      ],
    },
    {
      className: 'b',
      mono: 'Modo sin RTK · Solo SLAM',
      title: 'Interiores y espacios cubiertos',
      image: '/img/modo-portatil.jpg',
      imageAlt: 'Operador escaneando en modo portátil de mano con SLAM',
      items: [
        'Casas, bodegas, sótanos, túneles, parqueos subterráneos',
        'La nube usa coordenadas locales (empieza donde arrancaste)',
        'Ideal cuando solo importa la forma y las medidas',
        'En Rhino luego la mueves/orientas como quieras',
      ],
    },
  ],
  table: [
    {
      situation: 'Terreno o lote al aire libre',
      mode: 'Con RTK',
      why: 'Cielo abierto = coordenadas reales gratis',
    },
    {
      situation: 'Interior de casa o nave',
      mode: 'Sin RTK',
      why: 'Adentro no hay satélites; SLAM se basta',
    },
    {
      situation: 'Fachada + interior en un recorrido',
      mode: 'Con RTK (SLAM-Fix)',
      why: 'Empiezas afuera con FIX; al entrar cambia solo a SLAM y todo queda alineado',
    },
    {
      situation: 'Bosque denso / cañón urbano',
      mode: 'Con RTK activado',
      why: 'El SLAM rellena los cortes de señal',
    },
  ],
}

export const workflowRTK = {
  id: 'con-rtk',
  kicker: '03 · Paso a paso',
  title: 'Flujo de trabajo CON RTK',
  lead: 'Para exteriores y proyectos que necesitan coordenadas reales.',
  stepClass: 'g',
  steps: [
    {
      title: 'Prepara el equipo',
      body: 'Batería cargada (carga completa en ~2 h con cargador de 45 W), memoria libre y el celular/colector con la app Hi-Survey conectado por Wi-Fi o Bluetooth al SL9.',
      image: null,
    },
    {
      title: 'Conecta las correcciones RTK',
      body: 'En Hi-Survey, configura la conexión a tu red de correcciones (NTRIP con tu usuario y mountpoint, o radio UHF si trabajas con base propia). Espera a que el estado diga FIJO (FIX).',
      tip: '💡 "FIJO" = precisión centimétrica. "FLOTANTE" = todavía no; espera unos segundos en un lugar con cielo despejado.',
      image: null,
    },
    {
      title: 'Inicia el proyecto de escaneo',
      body: 'Crea un proyecto nuevo en Hi-Survey, elige el sistema de coordenadas de tu país/proyecto y arranca el modo escaneo SLAM. Comienza en un punto al aire libre con FIX para anclar todo a coordenadas reales.',
      image: '/img/software-satsurv.jpg',
      imageAlt: 'Capturas de la app Hi-Survey mostrando configuración de proyecto',
    },
    {
      title: 'Camina y escanea',
      body: 'Camina a paso tranquilo y constante, sosteniendo el equipo estable. Recorre el área con pasadas que se superpongan un poco. Evita giros bruscos y sacudidas: confunden al sensor de movimiento (IMU).',
      tip: '💡 Si pasas bajo techos o árboles, sigue caminando normal: el SLAM-Fix mantiene la precisión aunque se pierdan los satélites.',
      image: '/img/campo-escaneo.jpg',
      imageAlt: 'Operador escaneando una ladera al aire libre con el SL9',
    },
    {
      title: 'Cierra y revisa en el momento',
      body: 'Detén el escaneo en Hi-Survey y revisa la nube en la pantalla con el mapa de calor de precisión. ¿Zonas con huecos o color de baja calidad? Escanéalas de nuevo antes de irte del sitio.',
      image: '/img/slam-fix-puente.jpg',
      imageAlt: 'Escaneo bajo un puente demostrando SLAM-Fix cuando se pierde señal satelital',
    },
    {
      title: 'Exporta con coordenadas reales',
      body: 'La nube se exporta directamente en coordenadas unificadas (NEZ o BLH). Pásala a la computadora para el paso final en Sat-LiDAR y luego a Rhino.',
      image: null,
    },
  ],
}

export const workflowSLAM = {
  id: 'sin-rtk',
  kicker: '04 · Paso a paso',
  title: 'Flujo de trabajo SIN RTK',
  lead: 'Para interiores, sótanos, túneles o cualquier lugar sin cielo. Es aún más simple: no hay que configurar correcciones.',
  stepClass: 'b',
  steps: [
    {
      title: 'Prepara el equipo',
      body: 'Igual que antes: batería, memoria y Hi-Survey conectado. Ojo: en modo SLAM la batería interna dura menos (hasta ~2 h; con batería externa, hasta ~5 h). Lleva repuesto: el SL9 permite cambio en caliente sin apagar.',
      image: null,
    },
    {
      title: 'Elige un punto de arranque memorable',
      body: 'Empieza el escaneo en un lugar reconocible (una esquina, una puerta). Ese punto será el "cero" de tus coordenadas locales, y te ayudará a orientarte después en Rhino.',
      tip: '💡 Truco: si algún día necesitas georreferenciar este escaneo, marca 2–3 puntos físicos en el sitio (esquinas, clavos) que puedas medir después con RTK.',
      image: null,
    },
    {
      title: 'Escanea caminando en bucle',
      body: 'Recorre cada habitación o zona a paso constante. Aunque el SL9 no exige cerrar bucles, en interiores grandes ayuda terminar cerca de donde empezaste y pasar dos veces por los pasillos que conectan zonas.',
      image: '/img/slam-fix-puente.jpg',
      imageAlt: 'Escaneo en espacio semiabierto con el SL9 en modo SLAM',
    },
    {
      title: 'Cuidado con las superficies difíciles',
      body: 'Vidrios, espejos y superficies muy negras engañan al láser. Ventanas grandes pueden generar puntos "fantasma" afuera; no te preocupes, se limpian después en oficina.',
      image: '/img/medicion-imagen.jpg',
      imageAlt: 'Medición por imagen con precisión de 5 cm en el SL9',
    },
    {
      title: 'Revisa y exporta',
      body: 'Detén el escaneo, revisa la nube en Hi-Survey y exporta. La nube estará en coordenadas locales (metros desde tu punto de arranque), perfectas para modelar geometría en Rhino.',
      image: null,
    },
  ],
}

export const rhinoFlow = {
  kicker: '05 · Del escáner al modelo',
  title: 'Llevar la nube de puntos a Rhino',
  lead: 'El camino es el mismo para ambos flujos. La estación intermedia es Sat-LiDAR, el software de oficina, que limpia y afina la nube antes de modelar.',
  pipeline: [
    {
      mono: 'Campo',
      title: 'SL9 + Hi-Survey',
      body: 'Escaneas y exportas la nube cruda del equipo.',
    },
    {
      mono: 'Oficina',
      title: 'Sat-LiDAR',
      body: 'Procesas: la nube pasa a <2 cm de grosor y <1 cm de precisión. Limpias ruido y recortas.',
    },
    {
      mono: 'Exportar',
      title: 'Formato universal',
      body: 'Exporta a E57, LAS/LAZ, PTS o XYZ.',
    },
    {
      mono: 'Modelado',
      title: 'Rhino',
      body: 'Importas la nube y modelas encima.',
    },
  ],
  steps: [
    {
      title: 'Procesa en Sat-LiDAR',
      body: 'Abre el proyecto del escáner, deja que el software procese la trayectoria y la nube. Aprovecha para recortar lo que no necesitas (carros, gente, puntos fantasma de vidrios) y reducir densidad si la nube es gigante.',
      image: '/img/software-satlidar.jpg',
      imageAlt: 'Interfaz de Sat-LiDAR mostrando procesamiento de túnel y secciones',
    },
    {
      title: 'Exporta en un formato que Rhino entienda',
      body: 'Los más cómodos: .e57 (moderno, conserva color), .las/.laz (estándar LiDAR), .pts o .xyz (texto simple, universal).',
      warning:
        '⚠️ ¿Nube con RTK y coordenadas enormes (millones de metros)? Antes de exportar, aplica una traslación a un origen local o anota el desplazamiento. Rhino trabaja mejor con números cerca del origen.',
      image: '/img/volumen-coordenadas.jpg',
      imageAlt: 'Cálculo de volumen y sistema de coordenadas en el software',
    },
    {
      title: 'Importa en Rhino',
      body: 'Rhino 7 y 8 importan .e57, .pts y .xyz directamente con Archivo → Importar: la nube entra como objeto PointCloud. Para .las/.laz o nubes muy pesadas, plugins como Veesus Arena4D o CloudCompare hacen la vida fácil.',
      image: null,
    },
    {
      title: 'Configura unidades y tolerancias',
      body: 'Verifica que el archivo de Rhino esté en metros (el escáner exporta en metros). Revisa con el comando Distance que una medida conocida (un vano de puerta, por ejemplo) coincida con la realidad.',
      image: null,
    },
    {
      title: 'Modela sobre la nube',
      body: 'Usa la nube como plantilla 3D: activa el snap a puntos, dibuja secciones con ClippingPlane para "rebanar" la nube en plantas y cortes, y traza tus curvas y superficies encima. Para mallas automáticas, herramientas como Rhino 8 ShrinkWrap o Grasshopper con plugins de nubes (Cockroach, Volvox) convierten puntos en malla.',
      image: null,
    },
  ],
}

export const glossary = {
  kicker: '06 · Diccionario de bolsillo',
  title: 'Glosario para no perderse',
  terms: [
    {
      term: 'RTK',
      def: '"Cinemática en tiempo real". GPS con correcciones en vivo que baja el error de metros a centímetros.',
    },
    {
      term: 'SLAM',
      def: 'El escáner se ubica solo comparando lo que ve con el láser, sin satélites. Por eso funciona en interiores.',
    },
    {
      term: 'FIX / FLOTANTE',
      def: 'Estados del RTK. FIX = solución precisa (¡a trabajar!). Flotante = aún calculando (espera).',
    },
    {
      term: 'NTRIP',
      def: 'Las correcciones RTK que llegan por internet (SIM o Wi-Fi) desde una red de estaciones base.',
    },
    {
      term: 'Nube de puntos',
      def: 'Millones de puntos 3D con posición (y a veces color) que forman una "fotografía tridimensional" del sitio.',
    },
    {
      term: 'Georreferenciado',
      def: 'Que está en coordenadas del mundo real (por ejemplo CRTM05 en Costa Rica), no en un cero arbitrario.',
    },
    {
      term: 'NEZ / BLH',
      def: 'Formatos de coordenadas: Norte-Este-Elevación (plano) o Latitud-Longitud-Altura (geográfico).',
    },
    {
      term: 'E57 / LAS',
      def: 'Formatos de archivo estándar para intercambiar nubes de puntos entre programas.',
    },
    {
      term: 'IMU',
      def: 'Sensor de movimiento interno (como el del celular) que ayuda al SLAM a saber cómo se mueve el equipo.',
    },
  ],
}

export const checklist = {
  kicker: '07 · Antes de salir a campo',
  title: 'Checklist rápido',
  items: [
    'Batería interna cargada + batería externa de repuesto (SLAM consume más)',
    'Memoria libre suficiente en el equipo (512 GB internos, pero revisa)',
    'Hi-Survey actualizado y conectado al SL9',
    'Si usarás RTK: credenciales NTRIP a mano y SIM con datos (o radio UHF configurada)',
    'Sistema de coordenadas del proyecto elegido en Hi-Survey',
    'Plan de recorrido: por dónde empiezo, por dónde termino, pasadas con traslape',
    'Al terminar: revisar la nube EN SITIO antes de guardar el equipo',
    'En oficina: procesar en Sat-LiDAR → limpiar → exportar E57/PTS → importar en Rhino en metros',
  ],
}

export const footer = {
  mono: 'SL9 SLAM RTK',
  text: 'Guía de flujo de trabajo campo → Rhino · Basada en la documentación oficial del equipo. Las precisiones citadas dependen de condiciones de operación.',
}
