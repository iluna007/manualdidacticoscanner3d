import { Suspense, lazy } from 'react'
import { conceptosBasicos } from '../data/estaciones'
import { scanners } from '../data/scanners'
import { useRoute } from '../context/RouteContext'

const ScanDemo = lazy(() => import('./three/ScanDemo'))

export default function IntroSection() {
  const { scannerId } = useRoute()
  const scanner = scanners[scannerId]

  return (
    <section id="como-funciona" className="intro-section">
      <div className="wrap">
        <div className="kicker">¿Cómo funciona?</div>
        <h2>Tres ideas antes de iniciar el flujo</h2>
        <p className="lead">
          El {scanner.nombre} es dos instrumentos en uno. Estas tres tarjetas son los pasos
          conceptuales de partida.
        </p>

        <div className="basics-grid">
          <div className="cards">
            {conceptosBasicos.map((card) => (
              <div key={card.title} className="card">
                <span className={`tag ${card.tagClass}`}>{card.tag}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
          <div className="basics-image">
            <img
              src={scanner.imagenes.detalle}
              alt="Primer plano del escáner SL9"
              loading="lazy"
            />
          </div>
        </div>

        <div className="scan-demo-wrap">
          <Suspense fallback={<div className="scan-demo" aria-busy="true" />}>
            <ScanDemo />
          </Suspense>
          <p className="scan-demo-caption">
            Verde = con satélites (RTK), azul = sin satélites (SLAM)
          </p>
        </div>
      </div>
    </section>
  )
}
