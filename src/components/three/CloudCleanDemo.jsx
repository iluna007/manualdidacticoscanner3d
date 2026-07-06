import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const TOTAL = 30000
const NOISE_COUNT = 2000
const CAR_COUNT = 1500

function generateFacadePoints() {
  const positions = new Float32Array(TOTAL * 3)
  const colors = new Float32Array(TOTAL * 3)
  const types = new Uint8Array(TOTAL)
  let i = 0

  for (let x = -3; x <= 3; x += 0.08) {
    for (let y = 0; y <= 4; y += 0.08) {
      if (i >= TOTAL - NOISE_COUNT - CAR_COUNT) break
      positions[i * 3] = x + (Math.random() - 0.5) * 0.04
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.04
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08
      colors[i * 3] = 0.75
      colors[i * 3 + 1] = 0.72
      colors[i * 3 + 2] = 0.68
      types[i] = 0
      i++
    }
  }

  for (let j = 0; j < NOISE_COUNT && i < TOTAL; j++, i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = Math.random() * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      colors[i * 3] = 0.5 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.2
    types[i] = 1
  }

  for (let j = 0; j < CAR_COUNT && i < TOTAL; j++, i++) {
    positions[i * 3] = 2 + Math.random() * 1.5
    positions[i * 3 + 1] = Math.random() * 1.2
    positions[i * 3 + 2] = 1.5 + Math.random() * 1
    colors[i * 3] = 0.2
    colors[i * 3 + 1] = 0.4
    colors[i * 3 + 2] = 0.8
    types[i] = 2
  }

  return { positions, colors, types, count: i }
}

function FacadeCloud({ segmentCar, sorFilter, subsample, resetKey }) {
  const pointsRef = useRef()
  const data = useMemo(() => generateFacadePoints(), [resetKey])
  const opacities = useMemo(() => new Float32Array(data.count).fill(1), [data.count, resetKey])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions.slice(0, data.count * 3), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors.slice(0, data.count * 3), 3))
    return geo
  }, [data, resetKey])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = geometry.attributes.position.array
    const col = geometry.attributes.color.array
    let visible = 0

    for (let i = 0; i < data.count; i++) {
      let alpha = 1
      const t = data.types[i]

      if (segmentCar && t === 2) {
        opacities[i] = Math.max(0, opacities[i] - 0.05)
        alpha = opacities[i]
        pos[i * 3 + 1] -= 0.02
      }
      if (sorFilter && t === 1) {
        opacities[i] = Math.max(0, opacities[i] - 0.08)
        alpha = opacities[i]
      }
      if (subsample < 1 && t === 0) {
        alpha *= subsample
      }

      col[i * 3] = data.colors[i * 3] * alpha
      col[i * 3 + 1] = data.colors[i * 3 + 1] * alpha
      col[i * 3 + 2] = data.colors[i * 3 + 2] * alpha

      if (alpha > 0.05) visible++
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
    geometry.setDrawRange(0, data.count)
    pointsRef.current.userData.visible = visible
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation />
    </points>
  )
}

function Scene({ segmentCar, sorFilter, subsample, resetKey, inView }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} />
      <FacadeCloud
        segmentCar={segmentCar}
        sorFilter={sorFilter}
        subsample={subsample}
        resetKey={resetKey}
      />
      <OrbitControls enablePan={false} enabled={inView} />
    </>
  )
}

export default function CloudCleanDemo({ inView = true }) {
  const [segmentCar, setSegmentCar] = useState(false)
  const [sorFilter, setSorFilter] = useState(false)
  const [subsample, setSubsample] = useState(1)
  const [resetKey, setResetKey] = useState(0)

  const reset = useCallback(() => {
    setSegmentCar(false)
    setSorFilter(false)
    setSubsample(1)
    setResetKey((k) => k + 1)
  }, [])

  const estimatedPoints = Math.round(
    TOTAL * subsample * (segmentCar ? 0.95 : 1) * (sorFilter ? 0.93 : 1),
  )
  const fileSize = (estimatedPoints * 0.00003).toFixed(1)

  return (
    <div className="cloud-clean-demo">
      <div className="cloud-clean-demo__canvas">
        <Canvas
          camera={{ position: [6, 3, 6], fov: 45 }}
          frameloop={inView ? 'always' : 'demand'}
          style={{ background: '#2B2620', height: 460 }}
        >
          <Scene
            segmentCar={segmentCar}
            sorFilter={sorFilter}
            subsample={subsample}
            resetKey={resetKey}
            inView={inView}
          />
        </Canvas>
      </div>
      <div className="cloud-clean-demo__sidebar">
        <div className="cloud-clean-toolbar">
          <button
            type="button"
            aria-label="Segmentar y eliminar objeto"
            className={segmentCar ? 'active' : ''}
            onClick={() => setSegmentCar(true)}
          >
            ✂️ Segmentar
          </button>
          <button
            type="button"
            aria-label="Aplicar filtro SOR"
            className={sorFilter ? 'active' : ''}
            onClick={() => setSorFilter(true)}
          >
            🧹 Filtro SOR
          </button>
        </div>
        <label className="cloud-clean-slider">
          <span className="mono">📉 Submuestrear: {Math.round(subsample * 100)}%</span>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(subsample * 100)}
            onChange={(e) => setSubsample(Number(e.target.value) / 100)}
            aria-label="Porcentaje de submuestreo"
          />
        </label>
        {sorFilter && (
          <p className="cloud-clean-stat mono">-2,140 puntos de ruido eliminados</p>
        )}
        <p className="cloud-clean-counter">
          {TOTAL.toLocaleString()} → {estimatedPoints.toLocaleString()} puntos
          {subsample < 0.5 && ' · Rhino feliz 🎉'}
        </p>
        <p className="cloud-clean-file mono">Peso estimado: ~{fileSize} GB</p>
        <button type="button" className="cloud-clean-reset" onClick={reset} aria-label="Reiniciar demo">
          Reiniciar
        </button>
      </div>
    </div>
  )
}
