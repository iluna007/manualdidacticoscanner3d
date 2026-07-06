import { Suspense, lazy, useEffect } from 'react'
import { useInViewport } from '../hooks/useInViewport'

const ScannerShowcase = lazy(() => import('./three/ScannerShowcase'))

export default function ScannerShowcaseSection() {
  const [ref, inView] = useInViewport({ rootMargin: '200px' })

  useEffect(() => {
    if (!inView) return
    import('./three/ScannerShowcase').then((mod) => mod.preloadScannerModel?.())
  }, [inView])

  return (
    <section id="equipo" className="showcase-section showcase-section--immersive" ref={ref}>
      {inView ? (
        <Suspense
          fallback={
            <div className="showcase-loading showcase-loading--fullscreen">
              <span className="mono">Cargando modelo 3D…</span>
            </div>
          }
        >
          <ScannerShowcase active={inView} />
        </Suspense>
      ) : (
        <div className="showcase-loading showcase-loading--fullscreen" aria-hidden="true">
          <span className="mono">Desplazate aquí para cargar el modelo</span>
        </div>
      )}
    </section>
  )
}
