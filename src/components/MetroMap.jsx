import { useMemo } from 'react'
import {
  conexiones,
  estaciones,
  getPathD,
  getViewBox,
  getPositions,
  getEstacionIndex,
} from '../data/estaciones'
import { LINE_DASH } from '../data/scanners'
import { useRoute } from '../context/RouteContext'
import { useIsMobile } from '../hooks/useMediaQuery'

function labelOffset(est, mobile) {
  if (mobile) {
    if (est.linea === 'rtk') return { nameX: -10, nameY: 4, codeX: -10, codeY: 16, anchor: 'end' }
    if (est.linea === 'slam') return { nameX: 10, nameY: 4, codeX: 10, codeY: 16, anchor: 'start' }
    return { nameX: 0, nameY: -16, codeX: 0, codeY: -4, anchor: 'middle' }
  }
  if (est.linea === 'rtk') return { nameX: 0, nameY: -24, codeX: 0, codeY: -10, anchor: 'middle' }
  if (est.linea === 'slam') return { nameX: 0, nameY: 30, codeX: 0, codeY: 44, anchor: 'middle' }
  return { nameX: 0, nameY: -26, codeX: 0, codeY: -12, anchor: 'middle' }
}

function lineVar(linea) {
  return `var(--line-${linea})`
}

export default function MetroMap({
  estacionActiva,
  onStationClick,
  compact = false,
  featured = false,
  animateDraw = false,
  className = '',
}) {
  const mobile = useIsMobile()
  const layoutMobile = mobile && !compact
  const showLabels = !compact
  const { activeConnections, isStationActive } = useRoute()
  const positions = getPositions(layoutMobile)
  const viewBox = getViewBox(layoutMobile)

  const activeConnSet = useMemo(
    () => new Set(activeConnections.map((c) => `${c.from}-${c.to}`)),
    [activeConnections],
  )

  const activeIndex = useMemo(
    () => getEstacionIndex(estacionActiva),
    [estacionActiva],
  )

  const isConnCompleted = (conn) => {
    const toIdx = getEstacionIndex(conn.to)
    return toIdx >= 0 && toIdx <= activeIndex
  }

  const trainPos = useMemo(() => {
    const est = estaciones.find((e) => e.codigo === estacionActiva)
    return positions[est?.codigo] ?? positions['V-01']
  }, [estacionActiva, positions])

  const strokeW = featured ? 11 : compact ? 5 : layoutMobile ? 8 : 10
  const casingW = strokeW + (compact ? 4 : 7)
  const sharedStrokeW = featured ? 13 : strokeW + 2

  return (
    <svg
      className={`metro-map ${compact ? 'metro-map--compact' : ''} ${layoutMobile ? 'metro-map--mobile' : ''} ${featured ? 'metro-map--featured' : ''} ${className}`}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa de metro del flujo de escaneo 3D"
    >
      <defs>
        <filter id="metro-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x={0}
        y={0}
        width={viewBox.width}
        height={viewBox.height}
        fill="var(--metro-bg)"
        rx={compact ? 0 : 10}
      />

      {layoutMobile && !compact && (
        <>
          <text x={100} y={28} textAnchor="middle" className="metro-line-title">RTK · Línea A</text>
          <text x={300} y={28} textAnchor="middle" className="metro-line-title">SLAM · Línea B</text>
        </>
      )}

      {conexiones.map((conn, i) => {
        const key = `${conn.from}-${conn.to}`
        const routeActive = activeConnSet.has(key)
        const d = getPathD(conn.from, conn.to, layoutMobile)
        const completed = isConnCompleted(conn) && routeActive
        const dash = LINE_DASH[conn.linea]
        const w = conn.linea === 'shared' ? sharedStrokeW : strokeW

        return (
          <g key={key} opacity={routeActive ? 1 : 0.1} className={`metro-line-group metro-line-group--${conn.linea}`}>
            <path
              d={d}
              fill="none"
              stroke="var(--metro-casing)"
              strokeWidth={casingW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={d}
              fill="none"
              stroke={completed ? 'var(--line-active)' : lineVar(conn.linea)}
              strokeWidth={w}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={completed ? 'none' : dash || 'none'}
              opacity={completed ? 1 : 0.85}
              className={animateDraw ? 'metro-line-draw' : ''}
              style={animateDraw ? { animationDelay: `${i * 0.1}s` } : undefined}
            />
          </g>
        )
      })}

      {estaciones.map((est) => {
        const pos = positions[est.codigo]
        if (!pos) return null
        const { x, y } = pos
        const routeActive = isStationActive(est.codigo)
        const isCurrent = est.codigo === estacionActiva
        const isPast = getEstacionIndex(est.codigo) < activeIndex
        const isTransfer = est.tipo === 'transbordo'
        const isTerminal = est.tipo === 'terminal'
        const r = isTransfer ? (compact ? 8 : featured ? 14 : 12) : compact ? 5 : featured ? 10 : 9
        const lbl = labelOffset(est, layoutMobile)

        if (isTerminal) {
          return (
            <g
              key={est.codigo}
              className={`metro-station ${isCurrent ? 'current' : ''}`}
              opacity={routeActive ? 1 : 0.2}
              role="link"
              tabIndex={0}
              aria-label={`${est.codigo} ${est.nombre}`}
              onClick={() => onStationClick?.(est.codigo)}
              onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
            >
              <rect
                x={x - (compact ? 18 : featured ? 36 : 32)}
                y={y - (compact ? 8 : featured ? 16 : 14)}
                width={compact ? 36 : featured ? 72 : 64}
                height={compact ? 16 : featured ? 32 : 28}
                rx={4}
                fill={isCurrent ? 'var(--line-active)' : 'var(--metro-station-fill)'}
                stroke="var(--line-active)"
                strokeWidth={compact ? 2 : 3}
              />
              {showLabels && (
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="metro-label-terminal"
                  fill={isCurrent ? 'var(--metro-bg)' : 'var(--line-active)'}
                >
                  R-01 · RHINO
                </text>
              )}
            </g>
          )
        }

        return (
          <g
            key={est.codigo}
            className={`metro-station ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
            opacity={routeActive ? 1 : 0.2}
            role="link"
            tabIndex={0}
            aria-label={`${est.codigo} ${est.nombre}: ${est.resumen}`}
            onClick={() => onStationClick?.(est.codigo)}
            onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
          >
            {isCurrent && (
              <circle
                cx={x}
                cy={y}
                r={r + 10}
                fill="none"
                stroke="var(--line-active)"
                strokeWidth={1.5}
                opacity={0.35}
                className="metro-pulse-ring"
              />
            )}

            {isTransfer ? (
              <>
                <circle cx={x} cy={y} r={r + 6} fill="none" stroke="var(--line-transbordo)" strokeWidth={compact ? 3 : 5} />
                <circle
                  cx={x}
                  cy={y}
                  r={r - 2}
                  fill={isCurrent ? 'var(--line-active)' : 'var(--metro-station-fill)'}
                  stroke="var(--line-transbordo)"
                  strokeWidth={2.5}
                />
              </>
            ) : (
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={isCurrent ? 'var(--line-active)' : isPast ? 'var(--metro-station-past)' : 'var(--metro-station-fill)'}
                stroke={isCurrent ? 'var(--line-active)' : lineVar(est.linea)}
                strokeWidth={compact ? 2.5 : 3.5}
              />
            )}

            {showLabels && (
              <>
                <text
                  x={x + lbl.nameX}
                  y={y + lbl.nameY}
                  textAnchor={lbl.anchor}
                  className="metro-label"
                >
                  {est.nombre.length > 16 && layoutMobile ? `${est.nombre.slice(0, 14)}…` : est.nombre}
                </text>
                <text
                  x={x + lbl.codeX}
                  y={y + lbl.codeY}
                  textAnchor={lbl.anchor}
                  className="metro-code"
                >
                  {est.codigo}
                </text>
              </>
            )}

            <title>{`${est.codigo} · ${est.nombre} — ${est.resumen}`}</title>
          </g>
        )
      })}

      <g
        className="metro-train"
        transform={`translate(${trainPos.x}, ${trainPos.y})`}
        filter={compact ? undefined : 'url(#metro-glow)'}
      >
        <rect
          x={-(compact ? 4 : featured ? 7 : 6)}
          y={-(compact ? 3 : featured ? 5 : 4)}
          width={compact ? 8 : featured ? 14 : 12}
          height={compact ? 6 : featured ? 10 : 8}
          rx={2}
          fill="var(--line-active)"
        />
        <circle
          cx={0}
          cy={compact ? 5 : featured ? 8 : 7}
          r={compact ? 1.5 : 2}
          fill="var(--line-active)"
          opacity={0.45}
        />
      </g>
    </svg>
  )
}
