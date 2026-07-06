import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import { SCANNER_PARTS } from '../../data/scannerParts'
import { getScannerPalette } from './scannerPalette'
import { ShowcaseScene, preloadLidarModel } from './LidarSensorScene'

function computeScrollState(stepEls) {
  if (!stepEls.length) return { index: 0, blend: 0 }

  const mid = window.innerHeight * 0.5
  const centers = stepEls.map((el) => {
    const r = el.getBoundingClientRect()
    return r.top + r.height / 2
  })

  if (mid <= centers[0]) {
    return { index: 0, blend: 0 }
  }

  const lastIdx = stepEls.length - 1
  if (mid >= centers[lastIdx]) {
    return { index: lastIdx, blend: 0 }
  }

  for (let i = 0; i < lastIdx; i += 1) {
    const a = centers[i]
    const b = centers[i + 1]
    if (mid >= a && mid <= b) {
      const blend = (mid - a) / (b - a || 1)
      return { index: i, blend: THREE.MathUtils.clamp(blend, 0, 1) }
    }
  }

  return { index: 0, blend: 0 }
}

function lerpYaw(index, blend) {
  const a = SCANNER_PARTS[index]?.modelYaw ?? 0
  const b = SCANNER_PARTS[Math.min(index + 1, SCANNER_PARTS.length - 1)]?.modelYaw ?? a
  return THREE.MathUtils.lerp(a, b, blend)
}

export default function ScannerShowcase({ active = true }) {
  const { theme } = useTheme()
  const [scrollState, setScrollState] = useState({ index: 0, blend: 0 })
  const stepRefs = useRef([])
  const scrollRootRef = useRef(null)
  const rafRef = useRef(0)

  const { index: activeStep, blend } = scrollState
  const current = SCANNER_PARTS[activeStep] ?? SCANNER_PARTS[0]
  const yawOffset = lerpYaw(activeStep, blend)
  const introOpacity = activeStep === 0 ? Math.max(0, 1 - blend * 2.2) : 0
  const scenePalette = getScannerPalette(theme)

  useEffect(() => {
    if (!active) return undefined

    const update = () => {
      rafRef.current = 0
      const steps = stepRefs.current.filter(Boolean)
      if (!steps.length) return
      setScrollState((prev) => {
        const next = computeScrollState(steps)
        if (prev.index === next.index && Math.abs(prev.blend - next.blend) < 0.002) return prev
        return next
      })
    }

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  return (
    <div ref={scrollRootRef} className="showcase-scroll showcase-scroll--immersive">
      <div className="showcase-scroll__sticky" aria-hidden={!active}>
        <div
          className="showcase-canvas-wrap showcase-canvas-wrap--immersive"
          style={{ background: scenePalette.bg }}
        >
          <Canvas
            dpr={[1, 1.5]}
            shadows
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            frameloop={active ? 'always' : 'never'}
            camera={{ position: [...SCANNER_PARTS[0].camera.position], fov: 38 }}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <Suspense fallback={null}>
              <ShowcaseScene
                theme={theme}
                parts={SCANNER_PARTS}
                stepIndex={activeStep}
                blend={blend}
                yawOffset={yawOffset}
                active={active}
              />
            </Suspense>
          </Canvas>

          <div className="showcase-scroll__intro" style={{ opacity: introOpacity }}>
            <div className="kicker mono">00 · Conocé tu equipo</div>
            <h2>El SL9 SLAM RTK · Antes de empezar</h2>
            <p className="lead">
              Desplazate hacia abajo: el modelo gira y acerca la cámara a cada componente
              mientras leés la explicación del manual oficial.
            </p>
          </div>

          <div className="showcase-scroll__badge" aria-live="polite">
            <span className="showcase-scroll__badge-title">{current.nombre}</span>
            <span className="mono">
              {String(current.id).padStart(2, '0')} / {String(SCANNER_PARTS.length).padStart(2, '0')}
            </span>
          </div>

          <p className="showcase-scroll__hint mono" style={{ opacity: introOpacity }}>
            Scroll para recorrer las partes
          </p>
        </div>
      </div>

      <div className="showcase-scroll__steps">
        {SCANNER_PARTS.map((part, index) => (
          <article
            key={part.id}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            className={`showcase-step showcase-step--immersive ${
              activeStep === index ? 'showcase-step--active' : ''
            } ${activeStep + 1 === index && blend > 0.35 ? 'showcase-step--next' : ''}`}
            aria-current={activeStep === index ? 'step' : undefined}
          >
            <div className="showcase-step__panel">
              <span className="showcase-step__index mono">{String(part.id).padStart(2, '0')}</span>
              <h3>{part.nombre}</h3>
              <p>{part.desc}</p>
            </div>
          </article>
        ))}
        <div className="showcase-scroll__tail" aria-hidden="true" />
      </div>
    </div>
  )
}

export function preloadScannerModel() {
  preloadLidarModel()
}
