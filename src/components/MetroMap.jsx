import { useMemo } from 'react'
import { conexiones, estaciones, getPathD, VIEWBOX, LINE_COLORS } from '../data/estaciones'
import { useRoute } from '../context/RouteContext'

export default function MetroMap({
  estacionActiva,
  onStationClick,
  compact = false,
  animateDraw = false,
  className = '',
}) {
  const { activeConnections, isStationActive } = useRoute()

  const activeConnSet = useMemo(
    () => new Set(activeConnections.map((c) => `${c.from}-${c.to}`)),
    [activeConnections],
  )

  const trainPos = useMemo(() => {
    const est = estaciones.find((e) => e.codigo === estacionActiva)
    return est?.posicion ?? { x: 60, y: 100 }
  }, [estacionActiva])

  return (
    <svg
      className={`metro-map ${compact ? 'metro-map--compact' : ''} ${className}`}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      role="img"
      aria-label="Mapa de metro del flujo de escaneo 3D"
    >
      <title>Red de escaneo 3D · UCR Arquitectura</title>

      {conexiones.map((conn, i) => {
        const key = `${conn.from}-${conn.to}`
        const active = activeConnSet.has(key)
        const d = getPathD(conn.from, conn.to)
        return (
          <path
            key={key}
            d={d}
            fill="none"
            stroke={LINE_COLORS[conn.linea]}
            strokeWidth={compact ? 6 : 10}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 1 : 0.2}
            className={animateDraw ? 'metro-line-draw' : ''}
            style={animateDraw ? { animationDelay: `${i * 0.15}s` } : undefined}
          />
        )
      })}

      {estaciones.map((est) => {
        const { x, y } = est.posicion
        const active = isStationActive(est.codigo)
        const isCurrent = est.codigo === estacionActiva
        const isTransfer = est.tipo === 'transbordo'
        const isTerminal = est.tipo === 'terminal'
        const color = LINE_COLORS[est.linea] ?? LINE_COLORS.shared
        const r = isTransfer ? 13 : isTerminal ? 0 : compact ? 6 : 9

        if (isTerminal) {
          return (
            <g
              key={est.codigo}
              className={`metro-station ${active ? '' : 'dimmed'} ${isCurrent ? 'current' : ''}`}
              opacity={active ? 1 : 0.25}
              role="link"
              tabIndex={0}
              aria-label={`${est.codigo} ${est.nombre}`}
              onClick={() => onStationClick?.(est.codigo)}
              onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
            >
              <rect
                x={x - 28}
                y={y - 14}
                width={56}
                height={28}
                rx={4}
                fill="#fff"
                stroke={LINE_COLORS.shared}
                strokeWidth={4}
              />
              {!compact && (
                <text x={x} y={y + 5} textAnchor="middle" className="metro-label-terminal">
                  R-01 RHINO
                </text>
              )}
            </g>
          )
        }

        return (
          <g
            key={est.codigo}
            className={`metro-station ${active ? '' : 'dimmed'} ${isCurrent ? 'current' : ''}`}
            opacity={active ? 1 : 0.25}
            role="link"
            tabIndex={0}
            aria-label={`${est.codigo} ${est.nombre}: ${est.resumen}`}
            onClick={() => onStationClick?.(est.codigo)}
            onKeyDown={(e) => e.key === 'Enter' && onStationClick?.(est.codigo)}
          >
            {isTransfer ? (
              <>
                <circle cx={x} cy={y} r={r + 4} fill="none" stroke="#26221C" strokeWidth={5} />
                <circle cx={x} cy={y} r={r - 3} fill="#fff" stroke="#26221C" strokeWidth={2} />
              </>
            ) : (
              <circle
                cx={x}
                cy={y}
                r={r}
                fill="#fff"
                stroke={isTransfer ? '#26221C' : color}
                strokeWidth={compact ? 3 : 4}
                className={isCurrent ? 'metro-pulse' : ''}
              />
            )}
            {!compact && (
              <>
                <text
                  x={x}
                  y={y - (est.linea === 'rtk' ? 22 : est.linea === 'slam' ? -18 : 24)}
                  textAnchor="middle"
                  className="metro-label"
                >
                  {est.nombre}
                </text>
                <text
                  x={x}
                  y={y - (est.linea === 'rtk' ? 8 : est.linea === 'slam' ? -4 : 10)}
                  textAnchor="middle"
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

      <circle
        cx={trainPos.x}
        cy={trainPos.y}
        r={compact ? 5 : 7}
        className="metro-train"
        fill={LINE_COLORS[estaciones.find((e) => e.codigo === estacionActiva)?.linea] ?? '#E8641B'}
      />
    </svg>
  )
}
