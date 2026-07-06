import { scanners } from '../data/scanners'
import { useRoute } from '../context/RouteContext'
import MetroMap from './MetroMap'
import MetroLegend from './MetroLegend'

export default function HeroMapSection({ activeStation, onStationClick, mapDrawn }) {
  const { scannerId, routeBanner } = useRoute()
  const scanner = scanners[scannerId]

  return (
    <section className="hero-map-section" id="hero">
      <div className="wrap wrap--wide">
        <div className="hero-map__top">
          <div className="hero-map__intro">
            <div className="hero-map__intro-head">
              <div>
                <div className="eyebrow hero-map__eyebrow">MANUAL DIDÁCTICO · UCR ARQUITECTURA</div>
                <h1>Un manual para viajar del sitio al modelo</h1>
              </div>
            </div>
            <p className="hero-map__sub">
              Escaneá con el {scanner.nombre}, procesá la nube y modelá en Rhino. El mapa de abajo
              es tu guía: cada estación es un paso del flujo completo.
            </p>
            <div className="badges hero-map__badges">
              <span className="badge o">RTK + SLAM</span>
              <span className="badge">{scanner.specs.tasa}</span>
              <span className="badge">Alcance {scanner.specs.alcance}</span>
            </div>
          </div>
          <div className="hero-map__thumb">
            <img
              src={scanner.imagenes.hero}
              alt="Equipo SL9 SLAM RTK"
              loading="eager"
            />
          </div>
        </div>

        <div className="hero-map__network" id="mapa">
          <div className="hero-map__network-head">
            <div>
              <div className="kicker">El mapa de la red</div>
              <h2>Red de escaneo 3D · UCR Arquitectura</h2>
              <p className="lead hero-map__lead">
                Cada línea es una modalidad de captura; cada estación, un paso. Los transbordos
                (◉) son donde los flujos convergen o bifurcan. Hacé clic en una estación para ir
                directo a su sección.
              </p>
            </div>
          </div>

          <div className="hero-map__canvas-wrap">
            <MetroMap
              estacionActiva={activeStation}
              onStationClick={onStationClick}
              animateDraw={mapDrawn}
              featured
            />
          </div>

          <div className="hero-map__route mono" aria-live="polite">
            <span className="hero-map__route-label">Recorrido completo</span>
            <span className="hero-map__route-text">{routeBanner.text}</span>
            <span className="hero-map__route-count">· {routeBanner.count} estaciones</span>
          </div>

          <MetroLegend />
        </div>
      </div>
    </section>
  )
}
