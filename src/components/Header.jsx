import { scanners } from '../data/scanners'
import { useRoute } from '../context/RouteContext'

export default function Header() {
  const { scannerId, setScannerId } = useRoute()
  const scanner = scanners[scannerId]

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <div>
          <div className="eyebrow">Escuela de Arquitectura · UCR</div>
          <h1 className="site-header__title">Manual de Escaneo 3D</h1>
        </div>
        <div className="site-header__controls">
          <label className="scanner-select">
            <span className="mono">Equipo</span>
            <select
              value={scannerId}
              onChange={(e) => setScannerId(e.target.value)}
              aria-label="Seleccionar escáner"
            >
              {Object.values(scanners).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </label>
          <span className="badge o">{scanner.tipo}</span>
        </div>
      </div>
    </header>
  )
}
