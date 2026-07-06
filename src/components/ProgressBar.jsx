import { estaciones, getEstacionIndex, getEstacionByCodigo } from '../data/estaciones'

export default function ProgressBar({ activeStation }) {
  const activeIndex = getEstacionIndex(activeStation)
  const total = estaciones.length
  const stationProgress = total > 1 ? (activeIndex + 1) / total : 0
  const est = getEstacionByCodigo(activeStation)

  return (
    <div className="progress-bar-wrap" role="group" aria-label="Progreso del recorrido">
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={Math.round(stationProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: estación ${activeStation}`}
      >
        <div className="progress-bar__track">
          {estaciones.map((e, i) => (
            <div
              key={e.codigo}
              className={`progress-bar__tick ${i <= activeIndex ? 'progress-bar__tick--done' : ''} ${e.codigo === activeStation ? 'progress-bar__tick--current' : ''}`}
              title={e.codigo}
            />
          ))}
        </div>
        <div
          className="progress-bar__fill"
          style={{ width: `${Math.max(stationProgress * 100, 2)}%` }}
        />
      </div>
      <div className="progress-bar__label mono" aria-live="polite">
        <span className="progress-bar__code">{activeStation}</span>
        <span className="progress-bar__name">{est?.nombre ?? ''}</span>
        <span className="progress-bar__count">
          {activeIndex + 1}/{total}
        </span>
      </div>
    </div>
  )
}
