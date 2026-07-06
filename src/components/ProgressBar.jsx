export default function ProgressBar({ progress, activeStation }) {
  const linea = activeStation?.startsWith('V') ? 'rtk'
    : activeStation?.startsWith('A') ? 'slam'
    : activeStation?.startsWith('N') ? 'satlidar'
    : activeStation?.startsWith('M') ? 'cloudcompare'
    : 'shared'

  return (
    <div
      className={`progress-bar progress-bar--${linea}`}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso del recorrido"
    >
      <div className="progress-bar__fill" style={{ width: `${progress * 100}%` }} />
    </div>
  )
}
