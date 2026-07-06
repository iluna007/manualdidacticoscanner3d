import { LINE_LABELS, LEGEND_SWATCH } from '../data/scanners'

const LEGEND_ITEMS = [
  {
    linea: 'rtk',
    desc: 'Campo con RTK · exteriores georreferenciados (V-01…V-06)',
    style: 'solid',
  },
  {
    linea: 'slam',
    desc: 'Campo sin RTK · interiores en coordenadas locales (A-01…A-05)',
    style: 'dashed',
  },
  {
    linea: 'satlidar',
    desc: 'Oficina · software del fabricante (N-01…N-02)',
    style: 'dashdot',
  },
  {
    linea: 'cloudcompare',
    desc: 'Oficina · CloudCompare gratuito (M-01…M-03)',
    style: 'dotted',
  },
  {
    linea: 'shared',
    desc: 'Tramo común hacia Rhino (T-02 → R-01)',
    style: 'solid-thick',
  },
  {
    linea: 'transbordo',
    desc: 'Convergencia o bifurcación de flujos (T-01, T-02)',
    style: 'transfer',
  },
]

function Swatch({ linea, style, active }) {
  const strokeW = style === 'solid-thick' ? LEGEND_SWATCH.thick : LEGEND_SWATCH.normal

  return (
    <svg className={`legend-swatch ${active ? 'legend-swatch--active' : ''}`} viewBox="0 0 48 12" aria-hidden="true">
      {style === 'transfer' ? (
        <>
          <circle cx={24} cy={6} r={5} fill="var(--blanco)" stroke="var(--line-transbordo)" strokeWidth={3} />
          <circle cx={24} cy={6} r={2} fill="none" stroke="var(--line-transbordo)" strokeWidth={1.5} />
        </>
      ) : (
        <line
          x1={2}
          y1={6}
          x2={46}
          y2={6}
          stroke={`var(--line-${linea})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={
            style === 'dashed'
              ? '20 12'
              : style === 'dashdot'
                ? '8 8 24 8'
                : style === 'dotted'
                  ? '3 10'
                  : style === 'solid-thick'
                    ? '32 10'
                    : 'none'
          }
        />
      )}
    </svg>
  )
}

export default function MetroLegend({
  compact = false,
  highlightLinea = null,
  onHighlightLinea,
}) {
  return (
    <div className={`metro-legend ${compact ? 'metro-legend--compact' : ''}`} role="list" aria-label="Leyenda de flujos">
      {LEGEND_ITEMS.map((item) => {
        const active = highlightLinea === item.linea
        return (
          <div
            key={item.linea}
            className={`metro-legend__item ${active ? 'metro-legend__item--active' : ''}`}
            role="listitem"
            onMouseEnter={() => onHighlightLinea?.(item.linea)}
            onMouseLeave={() => onHighlightLinea?.(null)}
            onFocus={() => onHighlightLinea?.(item.linea)}
            onBlur={() => onHighlightLinea?.(null)}
            tabIndex={onHighlightLinea ? 0 : undefined}
          >
            <Swatch linea={item.linea} style={item.style} active={active} />
            <div className="metro-legend__text">
              <span className="metro-legend__label mono">{LINE_LABELS[item.linea]}</span>
              {!compact && <span className="metro-legend__desc">{item.desc}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
