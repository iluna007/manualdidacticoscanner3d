import { LINE_LABELS } from '../data/scanners'

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

function Swatch({ linea, style }) {
  return (
    <svg className="legend-swatch" viewBox="0 0 48 12" aria-hidden="true">
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
          strokeWidth={style === 'solid-thick' ? 5 : 4}
          strokeLinecap="round"
          strokeDasharray={
            style === 'dashed'
              ? '10 6'
              : style === 'dashdot'
                ? '4 4 12 4'
                : style === 'dotted'
                  ? '2 6'
                  : 'none'
          }
        />
      )}
    </svg>
  )
}

export default function MetroLegend({ compact = false }) {
  return (
    <div className={`metro-legend ${compact ? 'metro-legend--compact' : ''}`} role="list" aria-label="Leyenda de líneas del flujo">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.linea} className="metro-legend__item" role="listitem">
          <Swatch linea={item.linea} style={item.style} />
          <div className="metro-legend__text">
            <span className="metro-legend__label mono">{LINE_LABELS[item.linea]}</span>
            {!compact && <span className="metro-legend__desc">{item.desc}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
