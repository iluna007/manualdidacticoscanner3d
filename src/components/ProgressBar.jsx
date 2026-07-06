import { useMemo } from 'react'
import { estaciones, getEstacionIndex, getEstacionByCodigo, conexiones } from '../data/estaciones'
import { LINE_DASH } from '../data/scanners'
import { useRoute } from '../context/RouteContext'

const WIDTH = 1000
const HEIGHT = 16
const PAD = 10
const Y = HEIGHT / 2

function stationX(index, total) {
  if (total <= 1) return WIDTH / 2
  return PAD + (index / (total - 1)) * (WIDTH - PAD * 2)
}

function lineVar(linea) {
  return `var(--line-${linea})`
}

export default function ProgressBar({ activeStation }) {
  const { activeConnections, isStationActive } = useRoute()
  const activeIndex = getEstacionIndex(activeStation)
  const total = estaciones.length
  const est = getEstacionByCodigo(activeStation)
  const stationProgress = total > 1 ? (activeIndex + 1) / total : 0

  const segments = useMemo(() => {
    const list = []
    for (let i = 0; i < estaciones.length - 1; i += 1) {
      const from = estaciones[i].codigo
      const to = estaciones[i + 1].codigo
      const conn =
        activeConnections.find((c) => c.from === from && c.to === to) ||
        conexiones.find((c) => c.from === from && c.to === to)
      if (!conn) continue
      const onRoute = activeConnections.some((c) => c.from === from && c.to === to)
      list.push({
        key: `${from}-${to}`,
        linea: conn.linea,
        i,
        x1: stationX(i, total),
        x2: stationX(i + 1, total),
        onRoute,
      })
    }
    return list
  }, [activeConnections, total])

  return (
    <div className="progress-bar-wrap" role="group" aria-label="Progreso del recorrido">
      <div
        className="progress-bar progress-bar--metro"
        role="progressbar"
        aria-valuenow={Math.round(stationProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: estación ${activeStation}`}
      >
        <svg
          className="progress-bar__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={8} className="progress-bar__bg" />

          {segments.map((seg) => {
            const done = seg.i < activeIndex
            const current = seg.i === activeIndex
            const upcoming = seg.i > activeIndex
            const dash = LINE_DASH[seg.linea]
            const opacity = !seg.onRoute ? 0.15 : upcoming ? 0.55 : 1

            return (
              <g key={seg.key} opacity={opacity}>
                <line
                  x1={seg.x1}
                  y1={Y}
                  x2={seg.x2}
                  y2={Y}
                  className="progress-bar__casing"
                  strokeWidth={9}
                  strokeLinecap="round"
                />
                <line
                  x1={seg.x1}
                  y1={Y}
                  x2={seg.x2}
                  y2={Y}
                  className={`progress-bar__segment ${done ? 'progress-bar__segment--done' : ''} ${current ? 'progress-bar__segment--current' : ''}`}
                  stroke={done ? 'var(--line-active)' : lineVar(seg.linea)}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={done ? 'none' : dash || 'none'}
                />
              </g>
            )
          })}

          {estaciones.map((station, i) => {
            const x = stationX(i, total)
            const onRoute = isStationActive(station.codigo)
            const done = i < activeIndex
            const current = station.codigo === activeStation
            const r = current ? 5.5 : done ? 3.5 : 3

            return (
              <g
                key={station.codigo}
                className={`progress-bar__station ${current ? 'progress-bar__station--current' : ''} ${done ? 'progress-bar__station--done' : ''}`}
                opacity={onRoute ? 1 : 0.2}
              >
                {current && (
                  <circle
                    cx={x}
                    cy={Y}
                    r={9}
                    className="progress-bar__station-ring"
                  />
                )}
                <circle
                  cx={x}
                  cy={Y}
                  r={r}
                  className="progress-bar__station-dot"
                  fill={current ? 'var(--line-active)' : done ? 'var(--line-active)' : 'var(--metro-station-fill)'}
                  stroke={current ? 'var(--line-active)' : lineVar(station.linea)}
                  strokeWidth={current ? 0 : 2}
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="progress-bar__label mono" aria-live="polite">
        <span className="progress-bar__code progress-bar__code--pulse">{activeStation}</span>
        <span className="progress-bar__name">{est?.nombre ?? ''}</span>
        <span className="progress-bar__count">
          {activeIndex + 1}/{total}
        </span>
      </div>
    </div>
  )
}
