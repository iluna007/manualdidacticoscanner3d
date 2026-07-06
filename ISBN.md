# Registro de ISBN para este manual

Este repositorio incluye los metadatos bibliográficos necesarios para **solicitar un ISBN** y para que otros puedan **citar el manual** correctamente. El ISBN en sí no se genera en GitHub: lo asigna una agencia nacional o la editorial institucional.

## Estado actual

| Campo | Valor |
|-------|--------|
| Título | Manual de Escaneo 3D: Del sitio al modelo con SL9 SLAM RTK |
| Autores | Iker Luna, Felipe Barrante, María Esquivel |
| Institución | [Escuela de Arquitectura, UCR](https://arquis.ucr.ac.cr/) |
| Año | 2026 |
| ISBN | **Pendiente de registro** |
| Repositorio | https://github.com/iluna007/manualdidacticoscanner3d |

Cuando obtengas el ISBN, actualizá estos archivos:

1. `src/data/publication.js` → `isbn.isbn13` y `isbn.label`
2. `CITATION.cff` → bloque `identifiers` con `type: isbn`
3. `cite/manual.bib` → campo `isbn = {...}`
4. `README.md` → sección de citación

Ejemplo en `CITATION.cff` cuando tengas el número:

```yaml
identifiers:
  - type: isbn
    value: "978-XXXX-XXXX-X"
```

## Archivos de citación en este repositorio

| Archivo | Uso |
|---------|-----|
| [`CITATION.cff`](./CITATION.cff) | Activa el botón **“Cite this repository”** en GitHub |
| [`cite/manual.bib`](./cite/manual.bib) | BibTeX para LaTeX / gestores bibliográficos |
| [`src/data/publication.js`](./src/data/publication.js) | Metadatos mostrados en el pie del sitio web |
| [`LICENSE`](./LICENSE) | Licencia CC BY-NC 4.0 |

## Cómo solicitar un ISBN (Costa Rica / UCR)

1. **Definir el formato de publicación**
   - Solo web (recurso digital)
   - PDF descargable
   - Impreso (requiere maquetación y tiraje)

2. **Contactar la vía institucional**
   - Coordinación editorial o biblioteca de la [Escuela de Arquitectura](https://arquis.ucr.ac.cr/)
   - Editorial Universidad de Costa Rica (si aplica al tipo de publicación)
   - Oficina de investigación o extensión que respalde la publicación

3. **Preparar la ficha bibliográfica** (ya incluida en este repo):
   - Título y subtítulo
   - Autores y afiliación
   - Año, edición, idioma (español)
   - Descripción / resumen (ver `abstract` en `CITATION.cff`)
   - URL del repositorio o sitio publicado
   - Licencia: CC BY-NC 4.0

4. **Recibir el ISBN-13** (formato `978-…`)
   - Un ISBN distinto por cada formato (web, PDF, impreso)
   - El prefijo `978` identifica libros; el dígito de control se valida automáticamente

5. **Actualizar el repositorio** con el número asignado (ver lista arriba).

## Tópico `isbn` en GitHub

Para clasificar el repositorio en el ecosistema de publicaciones con ISBN en GitHub:

1. Abrí https://github.com/iluna007/manualdidacticoscanner3d  
2. Clic en el engranaje junto a **About**  
3. En **Topics**, agregá por ejemplo:
   - `isbn`
   - `3d-scanning`
   - `architecture-education`
   - `ucr`
   - `slam`
   - `point-cloud`
   - `react`
   - `threejs`

Referencia del tópico en GitHub: [github.com/topics/isbn](https://github.com/topics/isbn)

## Validar un ISBN (cuando lo tengas)

Podés comprobar el dígito de control con herramientas de validación ISBN-13, por ejemplo repositorios listados en [GitHub Topics · isbn](https://github.com/topics/isbn?o=asc&s=stars).

## Cita recomendada (mientras no hay ISBN)

**APA 7**

> Luna, I., Barrante, F., & Esquivel, M. (2026). *Manual de escaneo 3D: Del sitio al modelo con SL9 SLAM RTK*. Escuela de Arquitectura, Universidad de Costa Rica. https://github.com/iluna007/manualdidacticoscanner3d

**Chicago (autor-fecha)**

> Luna, Iker, Felipe Barrante, and María Esquivel. 2026. "Manual de Escaneo 3D: Del Sitio al Modelo con SL9 SLAM RTK." Escuela de Arquitectura, Universidad de Costa Rica. https://github.com/iluna007/manualdidacticoscanner3d.

## Depósito alternativo (DOI)

Si además necesitás un **DOI** para citación académica internacional, podés depositar una versión archivada en [Zenodo](https://zenodo.org/) vinculada a este repositorio de GitHub. Zenodo asigna DOI; el ISBN sigue siendo independiente y opcional para recursos web.
