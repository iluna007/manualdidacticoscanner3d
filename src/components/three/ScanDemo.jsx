import { useRef, useMemo, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_POINTS = 60000
const POINTS_PER_FRAME = 150
const SCAN_RADIUS = 6
const CYCLE_DURATION = 20

const RTK_COLOR = new THREE.Color('#1a1a1a')
const SLAM_COLOR = new THREE.Color('#666666')

const ROOM = { xMin: -8, xMax: 8, zMin: -8, zMax: 8, y: 0, wallH: 4 }
const DOOR_X = 0
const DOOR_Z = ROOM.zMin

function isOutside(x, z) {
  return z < ROOM.zMin - 0.5
}

function randomPointOnSurfaces(scannerPos) {
  const surfaces = []
  const { xMin, xMax, zMin, zMax, y, wallH } = ROOM

  for (let x = xMin; x <= xMax; x += 0.5) {
    surfaces.push([x, y, zMin])
    surfaces.push([x, y, zMax])
    surfaces.push([x, y + wallH, zMin])
    surfaces.push([x, y + wallH, zMax])
  }
  for (let z = zMin; z <= zMax; z += 0.5) {
    if (Math.abs(z - zMin) < 1 && Math.abs(DOOR_X - xMin) < 2) continue
    surfaces.push([xMin, y, z])
    surfaces.push([xMax, y, z])
    surfaces.push([xMin, y + wallH, z])
    surfaces.push([xMax, y + wallH, z])
  }

  const groundSize = 20
  for (let i = 0; i < 8; i++) {
    surfaces.push([
      (Math.random() - 0.5) * groundSize,
      y,
      -groundSize / 2 + Math.random() * (groundSize / 2 - 2),
    ])
  }

  const candidates = surfaces.filter(([x, , z]) => {
    const dx = x - scannerPos.x
    const dz = z - scannerPos.z
    return Math.sqrt(dx * dx + dz * dz) < SCAN_RADIUS
  })

  if (candidates.length === 0) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * SCAN_RADIUS
    return new THREE.Vector3(
      scannerPos.x + Math.cos(angle) * dist,
      ROOM.y + Math.random() * ROOM.wallH,
      scannerPos.z + Math.sin(angle) * dist,
    )
  }

  const [x, py, z] = candidates[Math.floor(Math.random() * candidates.length)]
  return new THREE.Vector3(x, py + Math.random() * 0.3, z)
}

const ScanScene = forwardRef(function ScanScene({ paused, onModeChange }, ref) {
  const scannerRef = useRef()
  const writeIndex = useRef(0)
  const totalPoints = useRef(0)
  const timeRef = useRef(0)
  const lastMode = useRef(null)

  const path = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.5, -18),
      new THREE.Vector3(0, 0.5, -12),
      new THREE.Vector3(0, 0.5, -6),
      new THREE.Vector3(0, 0.5, DOOR_Z + 1),
      new THREE.Vector3(4, 0.5, 2),
      new THREE.Vector3(6, 0.5, 4),
      new THREE.Vector3(4, 0.5, 6),
      new THREE.Vector3(-2, 0.5, 5),
      new THREE.Vector3(-5, 0.5, 2),
      new THREE.Vector3(-3, 0.5, -2),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(2, 0.5, -3),
      new THREE.Vector3(0, 0.5, DOOR_Z + 1),
      new THREE.Vector3(0, 0.5, -8),
      new THREE.Vector3(0, 0.5, -18),
    ]
    return new THREE.CatmullRomCurve3(points, true)
  }, [])

  const { positions, colors, geometry } = useMemo(() => {
    const positions = new Float32Array(MAX_POINTS * 3)
    const colors = new Float32Array(MAX_POINTS * 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setDrawRange(0, 0)
    return { positions, colors, geometry }
  }, [])

  const resetCloud = useCallback(() => {
    writeIndex.current = 0
    totalPoints.current = 0
    timeRef.current = 0
    geometry.setDrawRange(0, 0)
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  }, [geometry])

  useImperativeHandle(ref, () => ({ resetCloud }), [resetCloud])

  useFrame((_, delta) => {
    if (paused) return

    timeRef.current = (timeRef.current + delta) % CYCLE_DURATION
    const t = timeRef.current / CYCLE_DURATION
    const pos = path.getPointAt(t)
    if (scannerRef.current) scannerRef.current.position.copy(pos)

    const outside = isOutside(pos.x, pos.z)
    const mode = outside ? 'rtk' : 'slam'
    if (mode !== lastMode.current) {
      lastMode.current = mode
      onModeChange(mode)
    }

    const color = outside ? RTK_COLOR : SLAM_COLOR

    for (let i = 0; i < POINTS_PER_FRAME; i++) {
      const pt = randomPointOnSurfaces(pos)
      const idx = writeIndex.current % MAX_POINTS

      positions[idx * 3] = pt.x
      positions[idx * 3 + 1] = pt.y
      positions[idx * 3 + 2] = pt.z
      colors[idx * 3] = color.r
      colors[idx * 3 + 1] = color.g
      colors[idx * 3 + 2] = color.b

      writeIndex.current++
      if (totalPoints.current < MAX_POINTS) totalPoints.current++
    }

    geometry.setDrawRange(0, totalPoints.current)
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  })

  const wallMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#CFC9BD', transparent: true, opacity: 0.5 }),
    [],
  )

  const walls = useMemo(() => {
    const { xMin, xMax, zMin, zMax, y, wallH } = ROOM
    const makeWall = (pts) => {
      const geo = new THREE.BufferGeometry().setFromPoints(
        pts.map((p) => new THREE.Vector3(...p)),
      )
      return <lineSegments key={pts[0].join()} geometry={geo} material={wallMaterial} />
    }

    const segments = []
    const corners = [
      [xMin, zMin],
      [xMax, zMin],
      [xMax, zMax],
      [xMin, zMax],
    ]
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = corners[i]
      const [x2, z2] = corners[(i + 1) % 4]
      if (z1 === zMin && z2 === zMin) {
        segments.push(makeWall([
          [xMin, y, zMin],
          [-2, y, zMin],
        ]))
        segments.push(makeWall([
          [2, y, zMin],
          [xMax, y, zMin],
        ]))
        segments.push(makeWall([
          [xMin, y + wallH, zMin],
          [-2, y + wallH, zMin],
        ]))
        segments.push(makeWall([
          [2, y + wallH, zMin],
          [xMax, y + wallH, zMin],
        ]))
        segments.push(makeWall([
          [xMin, y, zMin],
          [xMin, y + wallH, zMin],
        ]))
        segments.push(makeWall([
          [-2, y, zMin],
          [-2, y + wallH, zMin],
        ]))
        segments.push(makeWall([
          [2, y, zMin],
          [2, y + wallH, zMin],
        ]))
        segments.push(makeWall([
          [xMax, y, zMin],
          [xMax, y + wallH, zMin],
        ]))
      } else {
        segments.push(makeWall([
          [x1, y, z1],
          [x2, y, z2],
        ]))
        segments.push(makeWall([
          [x1, y + wallH, z1],
          [x2, y + wallH, z2],
        ]))
        segments.push(makeWall([
          [x1, y, z1],
          [x1, y + wallH, z1],
        ]))
      }
    }
    return segments
  }, [wallMaterial])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROOM.y, -4]}>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#3a3530" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROOM.y, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#4a4540" />
      </mesh>
      {walls}
      <points geometry={geometry}>
        <pointsMaterial size={0.08} vertexColors sizeAttenuation />
      </points>
      <mesh ref={scannerRef} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.35, 0.8, 8]} />
        <meshStandardMaterial color="#333333" emissive="#333333" emissiveIntensity={0.2} />
      </mesh>
    </>
  )
})

export default function ScanDemo({ inView = true }) {
  const [paused, setPaused] = useState(false)
  const [mode, setMode] = useState('rtk')
  const sceneRef = useRef(null)

  const badgeText =
    mode === 'rtk'
      ? '🛰️ RTK — coordenadas reales'
      : '📡 SLAM — sin satélites, sigue ubicándose'

  return (
    <div className="scan-demo">
      <div className={`scan-badge ${mode}`} aria-live="polite">
        {badgeText}
      </div>
      <Canvas
        camera={{ position: [12, 10, 12], fov: 45 }}
        frameloop={paused || !inView ? 'demand' : 'always'}
        onCreated={({ camera }) => camera.lookAt(0, 1, -2)}
        style={{ background: '#2B2620' }}
      >
        <ScanScene
          ref={sceneRef}
          paused={paused}
          onModeChange={setMode}
        />
      </Canvas>
      <div className="scan-controls">
        <button
          type="button"
          aria-label={paused ? 'Reanudar animación de escaneo' : 'Pausar animación de escaneo'}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Reanudar' : 'Pausar'}
        </button>
        <button
          type="button"
          aria-label="Reiniciar nube de puntos"
          onClick={() => sceneRef.current?.resetCloud()}
        >
          Reiniciar nube
        </button>
      </div>
    </div>
  )
}
