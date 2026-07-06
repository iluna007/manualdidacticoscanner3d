import { Suspense, lazy } from 'react'
import { LINE_COLORS } from '../data/scanners'
import { useRoute } from '../context/RouteContext'
import { useInViewport } from '../hooks/useInViewport'

const ScanDemo = lazy(() => import('./three/ScanDemo'))
const CoordinateDemo = lazy(() => import('./three/CoordinateDemo'))
const CloudCleanDemo = lazy(() => import('./three/CloudCleanDemo'))

const DEMOS = {
  ScanDemo,
  CoordinateDemo,
  CloudCleanDemo,
}

function DemoLoader({ name }) {
  const [ref, inView] = useInViewport()
  const Demo = DEMOS[name]
  if (!Demo) return null

  return (
    <div ref={ref} className="station-demo">
      {inView && (
        <Suspense fallback={<div className="demo-placeholder" aria-busy="true" />}>
          <Demo inView={inView} />
        </Suspense>
      )}
    </div>
  )
}

export default function Station({ estacion, collapsed, onExpand }) {
  const { isStationActive } = useRoute()
  const active = isStationActive(estacion.codigo)
  const color = LINE_COLORS[estacion.linea] ?? LINE_COLORS.shared

  if (!active && collapsed) {
    return (
      <div
        id={`station-${estacion.codigo}`}
        className="station station--collapsed"
        style={{ '--line-color': color }}
      >
        <div className="wrap">
          <span className="station-code mono">{estacion.codigo}</span>
          <span className="station-name">{estacion.nombre}</span>
          <span className="station-resumen-short">{estacion.resumen}</span>
          <button type="button" className="station-expand-btn" onClick={onExpand}>
            Ver de todos modos
          </button>
        </div>
      </div>
    )
  }

  return (
    <section
      id={`station-${estacion.codigo}`}
      className="station station-section"
      style={{ '--line-color': color }}
      data-linea={estacion.linea}
    >
      <div className="wrap station-inner">
        <div className="station-header">
          <span className="station-code mono">{estacion.codigo}</span>
          <h2 className="station-title">{estacion.nombre}</h2>
          <p className="station-resumen">{estacion.resumen}</p>
        </div>

        <div className="station-meta">
          <span className="station-time mono">⏱️ {estacion.tiempo}</span>
        </div>

        <div className="station-body">
          <p>{estacion.cuerpo}</p>
        </div>

        {estacion.tip && <div className="station-tip">{estacion.tip}</div>}
        {estacion.errorNovato && (
          <div className="station-error">⚠️ Error de novato: {estacion.errorNovato}</div>
        )}

        {estacion.imagen && (
          <div className="station-image">
            <img
              src={estacion.imagen}
              alt={estacion.imagenAlt ?? estacion.nombre}
              loading="lazy"
            />
          </div>
        )}

        {estacion.demo && <DemoLoader name={estacion.demo} />}

        {estacion.pasos && (
          <div className="steps">
            {estacion.pasos.map((p) => (
              <div key={p.titulo} className="step">
                <h4>{p.titulo}</h4>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        )}

        {estacion.resumenTramo && (
          <div className="resumen-tramo">
            <h3>🎫 Resumen del tramo</h3>
            <ul>
              {estacion.resumenTramo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
