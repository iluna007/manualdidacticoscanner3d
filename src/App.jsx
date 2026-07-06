import { useEffect, useState, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RouteProvider, useRoute } from './context/RouteContext'
import { ThemeProvider } from './context/ThemeContext'
import { estaciones } from './data/estaciones'
import { useScrollProgress } from './hooks/useScrollProgress'
import Header from './components/Header'
import HeroMapSection from './components/HeroMapSection'
import IntroSection from './components/IntroSection'
import ScannerShowcaseSection from './components/ScannerShowcaseSection'
import PlanificarViaje from './components/PlanificarViaje'
import MetroMiniMap from './components/MetroMiniMap'
import Station from './components/Station'
import TransferStation from './components/TransferStation'
import ProgressBar from './components/ProgressBar'
import Glossary from './components/Glossary'
import Checklist from './components/Checklist'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function ManualContent() {
  const { scanLocation, processing, isStationActive } = useRoute()
  const { activeStation, scrollToStation } = useScrollProgress()
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
    const drawTimer = setTimeout(() => setMapDrawn(true), reduced ? 0 : 400)

    gsap.from('.hero-map__canvas-wrap', {
      opacity: 0,
      y: reduced ? 0 : 20,
      duration: reduced ? 0 : 0.8,
      delay: 0.15,
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

    return () => {
      clearTimeout(drawTimer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const handlePrint = () => window.print()

  return (
    <>
      <ProgressBar activeStation={activeStation} />
      <Header />

      <HeroMapSection
        activeStation={activeStation}
        onStationClick={scrollToStation}
        mapDrawn={mapDrawn}
      />

      <IntroSection />
      <ScannerShowcaseSection />
      <div ref={plannerRef}>
        <PlanificarViaje />
      </div>

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

      <Footer />

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
    <ThemeProvider>
      <RouteProvider>
        <ManualContent />
      </RouteProvider>
    </ThemeProvider>
  )
}
