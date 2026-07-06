import { Suspense, useMemo, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const LOW = '#2E5E8C'
const MID = '#3E7C4F'
const HIGH = '#E8641B'

function lerpColor(t) {
  const low = new THREE.Color(LOW)
  const mid = new THREE.Color(MID)
  const high = new THREE.Color(HIGH)
  if (t < 0.5) return low.clone().lerp(mid, t * 2)
  return mid.clone().lerp(high, (t - 0.5) * 2)
}

function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.15) * 1.2 +
    Math.cos(z * 0.12) * 1.0 +
    Math.sin(x * 0.35 + z * 0.25) * 0.6 +
    Math.cos(x * 0.08 - z * 0.1) * 0.4
  )
}

function TerrainPoints({ count }) {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const geometry = useMemo(() => {
    const size = 60
    const grid = Math.ceil(Math.sqrt(count))
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    let minY = Infinity
    let maxY = -Infinity
    const heights = []

    for (let i = 0; i < count; i++) {
      const gx = (i % grid) / grid
      const gz = Math.floor(i / grid) / grid
      const x = (gx - 0.5) * size
      const z = (gz - 0.5) * size
      const y = terrainHeight(x, z)
      heights.push(y)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    const range = maxY - minY || 1
    for (let i = 0; i < count; i++) {
      const t = (heights[i] - minY) / range
      const c = lerpColor(t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  const groupRef = useRef()

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += 0.02 * delta
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.06}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.85}
        />
      </points>
    </group>
  )
}

function Scene({ pointCount }) {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <TerrainPoints count={pointCount} />
      <OrbitControls
        enableZoom={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.3}
        enablePan={false}
      />
    </>
  )
}

export default function PointCloudHero() {
  const [pointCount, setPointCount] = useState(8000)

  useEffect(() => {
    const update = () => setPointCount(window.innerWidth > 768 ? 40000 : 8000)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="hero__canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [25, 18, 25], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene pointCount={pointCount} />
        </Suspense>
      </Canvas>
    </div>
  )
}
