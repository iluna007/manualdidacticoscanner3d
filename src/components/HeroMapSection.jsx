import { useState } from 'react'
import { scanners } from '../data/scanners'
import { useRoute } from '../context/RouteContext'
import MetroMap from './MetroMap'
import MetroLegend from './MetroLegend'
import GuiaPdfViewer from './GuiaPdfViewer'

export default function HeroMapSection({ activeStation, onStationClick, mapDrawn }) {
  const { scannerId } = useRoute()
  const scanner = scanners[scannerId]
  const [highlightLinea, setHighlightLinea] = useState(null)
  const [pdfOpen, setPdfOpen] = useState(false)

  return (
    <section className="hero-map-section" id="hero">
      <div className="wrap wrap--wide">
        <div className="hero-map__top">
          <div className="hero-map__intro">
            <div className="hero-map__intro-head">
              <div>
                <div className="eyebrow hero-map__eyebrow">MANUAL DIDÁCTICO · UCR ARQUITECTURA</div>
                <h1>Un manual del flujo: del sitio al modelo</h1>
              </div>
            </div>
            <p className="hero-map__sub">
              Escaneá con el {scanner.nombre}, procesá la nube y modelá en Rhino. El mapa de abajo
              es tu guía didáctica; el manual oficial del fabricante ({scanner.softwareCampo}) está
              a un clic en la imagen.
            </p>
            <div className="badges hero-map__badges">
              <span className="badge o">RTK + SLAM</span>
              <span className="badge">{scanner.specs.tasa}</span>
              <span className="badge">Alcance {scanner.specs.alcance}</span>
            </div>
          </div>
          <button
            type="button"
            className="hero-map__thumb"
            aria-label="Abrir GUIA DIDACTICA PARA SCANEAR UN ESPACIO en PDF"
            onClick={() => setPdfOpen(true)}
          >
            <img
              src={scanner.imagenes.hero}
              alt="Equipo SL9 SLAM RTK"
              loading="eager"
            />
            <span className="hero-map__thumb-hint" aria-hidden="true">
              Manual SL9
            </span>
          </button>
        </div>

        <div className="hero-map__network" id="mapa">
          <div className="hero-map__network-head">
            <div>
              <div className="kicker">El mapa de flujos</div>
              <h2>Flujos de escaneo 3D · UCR Arquitectura</h2>
              <p className="lead hero-map__lead">
                Cada trazo es una modalidad de captura; cada nodo, un paso. Las bifurcaciones
                (◉) marcan donde los flujos convergen o se separan. Hacé clic en un paso para ir
                directo a su sección.
              </p>
            </div>
          </div>

          <div className="hero-map__canvas-wrap">
            <MetroMap
              estacionActiva={activeStation}
              onStationClick={onStationClick}
              animateDraw={mapDrawn}
              highlightLinea={highlightLinea}
            />
          </div>

          <MetroLegend
            highlightLinea={highlightLinea}
            onHighlightLinea={setHighlightLinea}
          />
        </div>
      </div>

      <GuiaPdfViewer open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </section>
  )
}
