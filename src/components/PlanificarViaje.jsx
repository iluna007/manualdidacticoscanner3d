import { useRoute } from '../context/RouteContext'

const LOCATIONS = [
  { id: 'exterior', label: 'Exterior', desc: 'Línea A · RTK' },
  { id: 'interior', label: 'Interior', desc: 'Línea B · SLAM' },
  { id: 'ambos', label: 'Ambos', desc: 'Las dos líneas' },
]

const PROCESSING = [
  { id: 'satlidar', label: 'Software del equipo', desc: 'Sat-LiDAR' },
  { id: 'cloudcompare', label: 'CloudCompare', desc: 'Gratis · recomendado' },
  { id: 'unsure', label: 'Aún no sé', desc: 'Mostrar todo' },
]

export default function PlanificarViaje({ id = 'planificar' }) {
  const { scanLocation, setScanLocation, processing, setProcessing } = useRoute()

  return (
    <section id={id} className="planificar">
      <div className="wrap">
        <div className="kicker">Planificá tu viaje</div>
        <h2>¿Por dónde vas a viajar en el mapa?</h2>
        <p className="lead">
          Como una app de tránsito: elegí tu ruta y el mapa ilumina solo los tramos que te
          corresponden.
        </p>

        <div className="planificar__group">
          <h3>¿Dónde vas a escanear?</h3>
          <div className="planificar__options">
            {LOCATIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`planificar__btn ${scanLocation === opt.id ? 'active' : ''}`}
                onClick={() => setScanLocation(opt.id)}
                aria-pressed={scanLocation === opt.id}
              >
                <span className="planificar__btn-label">{opt.label}</span>
                <span className="planificar__btn-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="planificar__group">
          <h3>¿Con qué vas a procesar?</h3>
          <div className="planificar__options">
            {PROCESSING.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`planificar__btn ${processing === opt.id ? 'active' : ''}`}
                onClick={() => setProcessing(opt.id)}
                aria-pressed={processing === opt.id}
              >
                <span className="planificar__btn-label">{opt.label}</span>
                <span className="planificar__btn-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
