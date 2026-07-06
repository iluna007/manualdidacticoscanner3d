import { useMemo } from 'react'
import {
  conexiones,
  estaciones,
  getPathD,
  getViewBox,
  getPositions,
  getEstacionIndex,
  getStationContext,
  getContextViewBox,
} from '../data/estaciones'
import { LINE_DASH, LINE_WEIGHT } from '../data/scanners'
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
  contextStation = null,
  animateDraw = false,
  className = '',
}) {
  const mobile = useIsMobile()
  const isContext = Boolean(contextStation)
  const layoutMobile = mobile && !compact && !isContext
  const showLabels = isContext ? true : !compact
  const { activeConnections, isStationActive } = useRoute()

  const context = useMemo(() => {
    if (!contextStation) return null
    return getStationContext(contextStation, activeConnections)
  }, [contextStation, activeConnections])

  const contextCodes = useMemo(
    () => (context ? new Set(context.codes) : null),
    [context],
  )

  const positions = getPositions(layoutMobile)
  const viewBox = useMemo(() => {
    if (isContext && context?.codes.length) {
      return getContextViewBox(context.codes, layoutMobile, compact ? 48 : 64)
    }
    const base = getViewBox(layoutMobile)
    return { ...base, x: 0, y: 0 }
  }, [isContext, context, layoutMobile, compact])

  const visibleConnections = useMemo(() => {
    if (isContext && context) return context.segmentConnections
    return conexiones
  }, [isContext, context])

  const visibleStations = useMemo(() => {
    if (isContext && contextCodes) {
      return estaciones.filter((e) => contextCodes.has(e.codigo))
    }
    return estaciones
  }, [isContext, contextCodes])

  const activeConnSet = useMemo(
    () => new Set(activeConnections.map((c) => `${c.from}-${c.to}`)),
    [activeConnections],
  )

  const focusCode = contextStation ?? estacionActiva
  const activeIndex = useMemo(() => getEstacionIndex(focusCode), [focusCode])

  const isConnCompleted = (conn) => {
    const toIdx = getEstacionIndex(conn.to)
    return toIdx >= 0 && toIdx <= activeIndex
  }

  const trainPos = useMemo(() => {
    const est = estaciones.find((e) => e.codigo === focusCode)
    return positions[est?.codigo] ?? positions['V-01']
  }, [focusCode, positions])

  const strokeW = featured ? 11 : compact ? 5 : isContext ? 7 : layoutMobile ? 8 : 10
  const casingW = strokeW + (compact ? 4 : isContext ? 5 : 7)
  const sharedStrokeW = featured ? 14 : strokeW + 2
  const inactiveOpacity = featured ? 0.4 : 0.12

  const lineWidth = (linea) => {
    const scale = LINE_WEIGHT[linea] ?? 1
    const base = linea === 'shared' ? sharedStrokeW : strokeW
    return base * scale
  }

  return (
    <svg
      className={`metro-map ${compact ? 'metro-map--compact' : ''} ${layoutMobile ? 'metro-map--mobile' : ''} ${featured ? 'metro-map--featured' : ''} ${isContext ? 'metro-map--context' : ''} ${className}`}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={
        isContext
          ? `Tramo del mapa alrededor de ${contextStation}`
          : 'Mapa de metro del flujo de escaneo 3D'
      }
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

      {!isContext && (
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="var(--metro-bg)"
          rx={compact ? 0 : 10}
        />
      )}

      {isContext && (
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="var(--metro-bg)"
          rx={8}
        />
      )}

      {layoutMobile && !compact && !isContext && (
        <>
          <text x={100} y={28} textAnchor="middle" className="metro-line-title">RTK · Línea A</text>
          <text x={300} y={28} textAnchor="middle" className="metro-line-title">SLAM · Línea B</text>
        </>
      )}

      {visibleConnections.map((conn, i) => {
        const key = `${conn.from}-${conn.to}`
        const routeActive = isContext ? true : activeConnSet.has(key)
        const d = getPathD(conn.from, conn.to, layoutMobile)
        const completed = !isContext && isConnCompleted(conn) && routeActive
        const dash = LINE_DASH[conn.linea]
        const w = lineWidth(conn.linea)
        const groupOpacity = isContext ? 1 : routeActive ? 1 : inactiveOpacity

        return (
          <g
            key={key}
            opacity={groupOpacity}
            className={`metro-line-group metro-line-group--${conn.linea}`}
          >
            <path
              d={d}
              fill="none"
              stroke="var(--metro-casing)"
              strokeWidth={w + (isContext ? 5 : compact ? 3 : 6)}
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
              opacity={completed ? 1 : isContext ? 1 : 0.92}
              className={animateDraw && !isContext ? 'metro-line-draw' : ''}
              style={animateDraw && !isContext ? { animationDelay: `${i * 0.1}s` } : undefined}
            />
          </g>
        )
      })}

      {visibleStations.map((est) => {
        const pos = positions[est.codigo]
        if (!pos) return null
        const { x, y } = pos
        const routeActive = isContext ? true : isStationActive(est.codigo)
        const isCurrent = est.codigo === focusCode
        const isPast = !isContext && getEstacionIndex(est.codigo) < activeIndex
        const isTransfer = est.tipo === 'transbordo'
        const isTerminal = est.tipo === 'terminal'
        const r = isTransfer
          ? compact
            ? 8
            : isContext
              ? 10
              : featured
                ? 14
                : 12
          : compact
            ? 5
            : isContext
              ? 7
              : featured
                ? 10
                : 9
        const lbl = labelOffset(est, layoutMobile)

        if (isTerminal) {
          return (
            <g
              key={est.codigo}
              className={`metro-station ${isCurrent ? 'current' : ''}`}
              opacity={routeActive ? 1 : isContext ? 1 : 0.2}
              role="link"
              tabIndex={onStationClick ? 0 : undefined}
              aria-label={`${est.codigo} ${est.nombre}`}
              onClick={() => onStationClick?.(est.codigo)}
              onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
            >
              <rect
                x={x - (compact ? 18 : isContext ? 28 : featured ? 36 : 32)}
                y={y - (compact ? 8 : isContext ? 12 : featured ? 16 : 14)}
                width={compact ? 36 : isContext ? 56 : featured ? 72 : 64}
                height={compact ? 16 : isContext ? 24 : featured ? 32 : 28}
                rx={4}
                fill={isCurrent ? 'var(--line-active)' : 'var(--metro-station-fill)'}
                stroke={isCurrent ? 'var(--line-active)' : lineVar(est.linea)}
                strokeWidth={compact ? 2 : 3}
              />
              {showLabels && (
                <text
                  x={x}
                  y={y + (isContext ? 4 : 5)}
                  textAnchor="middle"
                  className="metro-label-terminal"
                  fill={isCurrent ? 'var(--metro-bg)' : 'var(--line-active)'}
                >
                  {isContext ? est.codigo : 'R-01 · RHINO'}
                </text>
              )}
            </g>
          )
        }

        return (
          <g
            key={est.codigo}
            className={`metro-station ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
            opacity={routeActive ? 1 : isContext ? 1 : 0.2}
            role={onStationClick ? 'link' : undefined}
            tabIndex={onStationClick ? 0 : undefined}
            aria-label={`${est.codigo} ${est.nombre}: ${est.resumen}`}
            onClick={() => onStationClick?.(est.codigo)}
            onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
          >
            {isCurrent && (
              <circle
                cx={x}
                cy={y}
                r={r + (compact ? 5 : isContext ? 8 : 10)}
                fill="none"
                stroke="var(--line-active)"
                strokeWidth={compact ? 1.25 : 1.5}
                opacity={0.35}
                className={`metro-pulse-ring ${compact ? 'metro-pulse-ring--compact' : ''}`}
              />
            )}

            {isTransfer ? (
              <>
                <circle
                  cx={x}
                  cy={y}
                  r={r + (isContext ? 4 : 6)}
                  fill="none"
                  stroke="var(--line-transbordo)"
                  strokeWidth={compact ? 3 : isContext ? 4 : 5}
                />
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
                strokeWidth={compact ? 2.5 : isContext ? 3 : 3.5}
              />
            )}

            {showLabels && (
              <>
                {!isContext && (
                  <text
                    x={x + lbl.nameX}
                    y={y + lbl.nameY}
                    textAnchor={lbl.anchor}
                    className="metro-label"
                  >
                    {est.nombre.length > 16 && layoutMobile ? `${est.nombre.slice(0, 14)}…` : est.nombre}
                  </text>
                )}
                <text
                  x={isContext ? x : x + lbl.codeX}
                  y={isContext ? y + 22 : y + lbl.codeY}
                  textAnchor={isContext ? 'middle' : lbl.anchor}
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

      {!isContext && (
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
      )}
    </svg>
  )
}
