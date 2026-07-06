import { Suspense, lazy } from 'react'
import { scanners } from '../data/scanners'
import { useRoute } from '../context/RouteContext'

const PointCloudHero = lazy(() => import('./three/PointCloudHero'))

export default function Hero() {
  const { scannerId } = useRoute()
  const scanner = scanners[scannerId]

  return (
    <section className="hero" id="hero">
      <Suspense fallback={null}>
        <PointCloudHero />
      </Suspense>
      <div className="wrap hero__inner">
        <div>
          <div className="eyebrow">MANUAL DIDÁCTICO · UCR ARQUITECTURA</div>
          <h1>Un manual para viajar del sitio al modelo</h1>
          <p className="sub">
            Escaneá con el {scanner.nombre}, procesá la nube y modelá en Rhino. Seguí el mapa de
            metro: cada estación es un paso del flujo.
          </p>
          <div className="badges">
            <span className="badge o">RTK + SLAM</span>
            <span className="badge">{scanner.specs.tasa}</span>
            <span className="badge">Alcance {scanner.specs.alcance}</span>
            <span className="badge">{scanner.specs.precision}</span>
          </div>
        </div>
        <div className="hero__image-wrap">
          <img
            src={scanner.imagenes.hero}
            alt="Equipo SL9 SLAM RTK, portada del manual"
          />
        </div>
      </div>
    </section>
  )
}
