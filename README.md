# Manual de Escaneo 3D · UCR Arquitectura

Manual didáctico interactivo para estudiantes de la [Escuela de Arquitectura, Universidad de Costa Rica](https://arquis.ucr.ac.cr/). Guía el flujo completo de escaneo 3D con **SatLab SL9 SLAM RTK**: captura en campo, procesamiento de nube de puntos y modelado en **Rhino**, organizado como un **mapa de flujos** con pasos y combinaciones configurables.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![ISBN](https://img.shields.io/badge/ISBN-pendiente-orange)](./ISBN.md)

**Repositorio:** https://github.com/iluna007/manualdidacticoscanner3d

## Autores

| Autor | Enlaces |
|-------|---------|
| **Iker Luna** | [Portfolio](https://ikerluna.netlify.app/) · [CV](https://ikercv.netlify.app/) · [GitHub](https://github.com/iluna007) |
| **Felipe Barrante** | — |
| **María Esquivel** | — |

*Escuela de Arquitectura, Universidad de Costa Rica · 2026*

## Vista previa

El manual organiza el proceso como un mapa de flujos:

- **19 pasos** (V-01 … R-01) que representan cada etapa del flujo
- **Flujos** para RTK, SLAM, Sat-LiDAR y CloudCompare
- **Planificador de flujo** según tipo de sitio (exterior / interior / ambos) y software de procesamiento
- **Demos Three.js** para conceptos clave (nube de puntos, coordenadas, limpieza)
- **Modo día / noche** y diseño responsive

## Desarrollo local

```bash
git clone https://github.com/iluna007/manualdidacticoscanner3d.git
cd manualdidacticoscanner3d
npm install
npm run dev
```

Abre http://localhost:5173/

### Build de producción

```bash
npm run build
npm run preview
```

## Despliegue (Netlify)

El proyecto incluye [`netlify.toml`](./netlify.toml):

- **Build:** `npm run build`
- **Publish:** `dist`
- **Node:** 22

## Estructura del proyecto

```
src/
├── components/     # UI: mapa de flujos, pasos, footer, demos 3D
├── context/        # Ruta activa y tema día/noche
├── data/           # Pasos, escáneres, glosario, publicación
└── hooks/          # Scroll y progreso
public/
└── img/            # Imágenes del manual y logos UCR/EAQ
```

## Cómo citar

**APA 7**

```text
Luna, I., Barrante, F., & Esquivel, M. (2026). Manual de escaneo 3D: Del sitio al modelo con SL9 SLAM RTK. Escuela de Arquitectura, Universidad de Costa Rica. https://github.com/iluna007/manualdidacticoscanner3d
```

- **CITATION.cff** — metadatos para el botón “Cite this repository” de GitHub  
- **cite/manual.bib** — entrada BibTeX  
- **[ISBN.md](./ISBN.md)** — guía para solicitar y registrar el ISBN  

> **ISBN:** pendiente de registro. Ver [ISBN.md](./ISBN.md) para los pasos y archivos a actualizar.

## Licencia

[Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](./LICENSE)

Podés compartir y adaptar el material con atribución y sin uso comercial.

## Tópicos sugeridos en GitHub

En **Settings → General → Topics** del repositorio, podés agregar:

`isbn` · `3d-scanning` · `architecture-education` · `ucr` · `slam` · `point-cloud` · `react` · `threejs` · `vite`

Ver también: [GitHub Topics · isbn](https://github.com/topics/isbn)

## Enlaces

- [Escuela de Arquitectura UCR](https://arquis.ucr.ac.cr/)
- [Universidad de Costa Rica](https://www.ucr.ac.cr/)
- [Portfolio Iker Luna](https://ikerluna.netlify.app/)
- [CV Iker Luna](https://ikercv.netlify.app/)

## Equipo documentado

**SatLab SL9 SLAM RTK** — software de campo Hi-Survey · procesamiento Sat-LiDAR · flujo alternativo CloudCompare · modelado Rhino.

Las precisiones y especificaciones citadas dependen de las condiciones reales de operación en sitio.
