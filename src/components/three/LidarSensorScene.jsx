import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { getScannerPalette } from './scannerPalette'
import { stylizeScannerMesh } from './stylizeModel'
import { PartHighlightRing } from './PartHighlightRing'

const MODEL_URL = '/models/lidar-sensor.glb'

const BASE_YAW = Math.PI * 0.2

export function normalizeModel(root) {
  const box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = 1 / maxDim

  root.position.sub(center)
  root.scale.setScalar(scale)
  root.rotation.y = BASE_YAW

  return { size, scale }
}

function lerpCameraView(a, b, t, outPos, outTarget) {
  outPos.set(
    THREE.MathUtils.lerp(a.position[0], b.position[0], t),
    THREE.MathUtils.lerp(a.position[1], b.position[1], t),
    THREE.MathUtils.lerp(a.position[2], b.position[2], t),
  )
  outTarget.set(
    THREE.MathUtils.lerp(a.target[0], b.target[0], t),
    THREE.MathUtils.lerp(a.target[1], b.target[1], t),
    THREE.MathUtils.lerp(a.target[2], b.target[2], t),
  )
}

function ModelLoadOverlay() {
  const { progress, active } = useProgress()
  if (!active || progress >= 100) return null

  return (
    <Html center zIndexRange={[10, 0]}>
      <div className="showcase-model-loader mono" aria-live="polite">
        Cargando modelo 3D… {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function LidarSensorModel({ theme, yawOffset = 0, onReady }) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef()

  const group = useMemo(() => {
    const clone = scene.clone(true)
    stylizeScannerMesh(clone, theme)
    const info = normalizeModel(clone)
    onReady?.(info)
    return clone
  }, [scene, theme, onReady])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const goal = BASE_YAW + yawOffset
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      goal,
      1 - Math.exp(-4 * dt),
    )
  })

  return <primitive ref={groupRef} object={group} />
}

function SceneLighting({ palette }) {
  return (
    <>
      <ambientLight intensity={palette.ambient} />
      <directionalLight
        position={[2.8, 3.5, 2.2]}
        intensity={palette.key}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-2.2, 1.2, -1.4]} intensity={palette.fill} />
      <directionalLight position={[0, 0.5, -2.5]} intensity={palette.rim} />
      <hemisphereLight args={[palette.hemiSky, palette.hemiGround, 0.22]} />
    </>
  )
}

export function ScrollCamera({ parts, stepIndex, blend, active }) {
  const { camera } = useThree()
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))

  useLayoutEffect(() => {
    const first = parts[0]?.camera
    if (!first) return
    goalPos.current.set(...first.position)
    goalTarget.current.set(...first.target)
    currentTarget.current.copy(goalTarget.current)
    camera.position.copy(goalPos.current)
    camera.lookAt(currentTarget.current)
  }, [camera, parts])

  useFrame((_, dt) => {
    if (!active || !parts.length) return

    const a = parts[stepIndex]?.camera ?? parts[0].camera
    const b = parts[Math.min(stepIndex + 1, parts.length - 1)]?.camera ?? a
    lerpCameraView(a, b, blend, goalPos.current, goalTarget.current)

    const t = 1 - Math.exp(-6 * dt)
    camera.position.lerp(goalPos.current, t)
    currentTarget.current.lerp(goalTarget.current, t)
    camera.lookAt(currentTarget.current)
  })

  return null
}

export function ShowcaseScene({ theme = 'day', parts, stepIndex, blend, yawOffset, active, onModelReady }) {
  const palette = getScannerPalette(theme)

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <SceneLighting palette={palette} />
      <ModelLoadOverlay />
      <Suspense fallback={null}>
        <LidarSensorModel key={theme} theme={theme} yawOffset={yawOffset} onReady={onModelReady} />
      </Suspense>
      <PartHighlightRing
        theme={theme}
        parts={parts}
        stepIndex={stepIndex}
        blend={blend}
        active={active}
      />
      <ContactShadows
        position={[0, -0.48, 0]}
        opacity={palette.shadow}
        scale={1.5}
        blur={1.8}
        far={0.85}
        resolution={512}
        color="#000000"
      />
      <ScrollCamera parts={parts} stepIndex={stepIndex} blend={blend} active={active} />
    </>
  )
}

export function preloadLidarModel() {
  useGLTF.preload(MODEL_URL)
}
