export const publication = {
  title: 'Manual de Escaneo 3D',
  subtitle: 'Del sitio al modelo con SL9 SLAM RTK',
  institution: 'Escuela de Arquitectura, Universidad de Costa Rica',
  year: 2026,
  version: '1.0.0',
  repository: 'https://github.com/iluna007/manualdidacticoscanner3d',
  license: 'CC BY-NC 4.0',
  isbn: {
    status: 'pending',
    isbn13: null,
    label: 'ISBN pendiente de registro',
  },
  authors: [
    {
      name: 'Iker Luna',
      role: 'Coautor · desarrollo web',
      links: {
        portfolio: 'https://ikerluna.netlify.app/',
        cv: 'https://ikercv.netlify.app/',
        github: 'https://github.com/iluna007',
      },
    },
    {
      name: 'Felipe Barrante',
      role: 'Coautor',
      links: {},
    },
    {
      name: 'María Esquivel',
      role: 'Coautora',
      links: {},
    },
  ],
  links: {
    school: 'https://arquis.ucr.ac.cr/',
    ucr: 'https://www.ucr.ac.cr/',
    github: 'https://github.com/iluna007/manualdidacticoscanner3d',
  },
  logos: {
    ucr: '/img/logos/ucr.svg',
    eaq: '/img/logos/eaq.svg',
  },
  citation: {
    apa:
      'Luna, I., Barrante, F., & Esquivel, M. (2026). Manual de escaneo 3D: Del sitio al modelo con SL9 SLAM RTK. Escuela de Arquitectura, Universidad de Costa Rica. https://github.com/iluna007/manualdidacticoscanner3d',
    chicago:
      'Luna, Iker, Felipe Barrante, and María Esquivel. 2026. "Manual de Escaneo 3D: Del Sitio al Modelo con SL9 SLAM RTK." Escuela de Arquitectura, Universidad de Costa Rica. https://github.com/iluna007/manualdidacticoscanner3d.',
  },
  disclaimer:
    'Manual didáctico basado en el manual oficial SatLab SL9 SLAM RTK (V1.0, May 2025). Las precisiones citadas dependen de las condiciones de operación en campo.',
  guidePdf: {
    title: 'GUIA DIDACTICA PARA SCANEAR UN ESPACIO',
    subtitle: 'Manual oficial SatLab SL9 SLAM RTK · V1.0 (May 2025)',
    defaultLang: 'en',
    languages: [
      {
        id: 'es',
        label: 'Español',
        available: false,
        notice:
          'La versión en español de esta guía estará disponible próximamente. Mientras tanto, consultá el manual oficial del fabricante en inglés.',
      },
      {
        id: 'en',
        label: 'English',
        available: true,
        src: '/docs/sl9-slam-rtk-user-manual-en.pdf',
        downloadName: 'SL9-SLAM-RTK-User-Manual.pdf',
        docTitle: 'SL9 SLAM RTK User Manual',
      },
    ],
  },
}
