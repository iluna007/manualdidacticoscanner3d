import { useEffect, useState, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RouteProvider, useRoute } from './context/RouteContext'
import { estaciones } from './data/estaciones'
import { useScrollProgress } from './hooks/useScrollProgress'
import Header from './components/Header'
import Hero from './components/Hero'
import IntroSection from './components/IntroSection'
import PlanificarViaje from './components/PlanificarViaje'
import MetroMap from './components/MetroMap'
import MetroMiniMap from './components/MetroMiniMap'
import Station from './components/Station'
import TransferStation from './components/TransferStation'
import RouteBanner from './components/RouteBanner'
import ProgressBar from './components/ProgressBar'
import Glossary from './components/Glossary'
import Checklist from './components/Checklist'

gsap.registerPlugin(ScrollTrigger)

function ManualContent() {
  const { scanLocation, processing, isStationActive } = useRoute()
  const { activeStation, progress, scrollToStation } = useScrollProgress()
  const [expanded, setExpanded] = useState(() => new Set())
  const [mapDrawn, setMapDrawn] = useState(false)
  const plannerRef = useRef(null)

  const shouldCollapse = scanLocation !== 'ambos' || processing !== 'unsure'

  const handleExpand = useCallback((codigo) => {
    setExpanded((prev) => new Set(prev).add(codigo))
  }, [])

  const scrollToPlanner = useCallback(() => {
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setMapDrawn(true)
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
    tl.to('.hero h1', { opacity: 0.3, y: -20 }, 0)

    gsap.from('.metro-map-section', {
      scrollTrigger: { trigger: '.metro-map-section', start: 'top 80%' },
      opacity: 0,
      y: 30,
      duration: 0.8,
      onComplete: () => setMapDrawn(true),
    })

    const sections = gsap.utils.toArray('.station-section, .transfer-station')
    sections.forEach((section) => {
      gsap.from(section.querySelector('.station-inner'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: reduced ? 0 : 16,
        duration: reduced ? 0 : 0.5,
      })
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const handlePrint = () => window.print()

  return (
    <>
      <ProgressBar progress={progress} activeStation={activeStation} />
      <Header />
      <RouteBanner />

      <Hero />
      <IntroSection />
      <div ref={plannerRef}>
        <PlanificarViaje />
      </div>

      <section className="metro-map-section" id="mapa">
        <div className="wrap">
          <div className="kicker">El mapa de la red</div>
          <h2>Red de escaneo 3D · UCR Arquitectura</h2>
          <p className="lead">
            Cada línea es una modalidad; cada estación, un paso. Los transbordos son donde los
            flujos convergen o bifurcan.
          </p>
          <MetroMap
            estacionActiva={activeStation}
            onStationClick={scrollToStation}
            animateDraw={mapDrawn}
          />
        </div>
      </section>

      <main className="stations-main">
        {estaciones.map((est) => {
          const collapsed =
            shouldCollapse && !isStationActive(est.codigo) && !expanded.has(est.codigo)

          if (est.tipo === 'transbordo') {
            return <TransferStation key={est.codigo} estacion={est} />
          }

          return (
            <Station
              key={est.codigo}
              estacion={est}
              collapsed={collapsed}
              onExpand={() => handleExpand(est.codigo)}
            />
          )
        })}
      </main>

      <Glossary />
      <Checklist />

      <footer>
        <div className="wrap">
          <span className="mono">Manual didáctico</span> · Escuela de Arquitectura, Universidad de
          Costa Rica. Basado en la documentación del SatLab SL9 SLAM RTK. Las precisiones dependen
          de las condiciones de operación.
        </div>
      </footer>

      <MetroMiniMap
        estacionActiva={activeStation}
        onStationClick={scrollToStation}
        onOpenPlanner={scrollToPlanner}
      />

      <button type="button" className="print-btn" onClick={handlePrint} aria-label="Versión imprimible">
        🖨️ Versión imprimible
      </button>
    </>
  )
}

export default function App() {
  return (
    <RouteProvider>
      <ManualContent />
    </RouteProvider>
  )
}
