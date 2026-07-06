import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getScannerPalette } from './scannerPalette'

const _camDir = new THREE.Vector3()
const _goalPos = new THREE.Vector3()
const _currentPos = new THREE.Vector3()

function getHighlightPoint(part) {
  const h = part.highlight?.position ?? part.camera.target
  return h
}

function getHighlightRadius(part, fallback = 0.1) {
  return part.highlight?.radius ?? fallback
}

function lerpHighlight(a, b, t, outPos, outRadius) {
  const pa = getHighlightPoint(a)
  const pb = getHighlightPoint(b)
  outPos.set(
    THREE.MathUtils.lerp(pa[0], pb[0], t),
    THREE.MathUtils.lerp(pa[1], pb[1], t),
    THREE.MathUtils.lerp(pa[2], pb[2], t),
  )
  outRadius.current = THREE.MathUtils.lerp(
    getHighlightRadius(a),
    getHighlightRadius(b),
    t,
  )
}

/**
 * Anillo billboard en el punto de atención de cada vista — visible en los 3 temas.
 */
export function PartHighlightRing({ theme, parts, stepIndex, blend, active }) {
  const groupRef = useRef()
  const radiusRef = useRef(0.12)
  const { camera } = useThree()
  const palette = getScannerPalette(theme)

  const materials = useMemo(() => {
    const fill = new THREE.MeshBasicMaterial({
      color: palette.highlightFill,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
    const ring = new THREE.MeshBasicMaterial({
      color: palette.highlightRing,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      toneMapped: false,
    })
    const ringInner = new THREE.MeshBasicMaterial({
      color: palette.highlightRing,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      toneMapped: false,
    })
    return { fill, ring, ringInner }
  }, [palette.highlightFill, palette.highlightRing])

  useFrame((state, dt) => {
    if (!active || !groupRef.current || !parts.length) return

    const a = parts[stepIndex] ?? parts[0]
    const b = parts[Math.min(stepIndex + 1, parts.length - 1)] ?? a
    lerpHighlight(a, b, blend, _goalPos, radiusRef)

    const lerpT = 1 - Math.exp(-8 * dt)
    _currentPos.lerp(_goalPos, lerpT)

    _camDir.copy(camera.position).sub(_currentPos).normalize()
    groupRef.current.position.copy(_currentPos).addScaledVector(_camDir, 0.018)
    groupRef.current.lookAt(camera.position)

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.035
    const s = radiusRef.current * pulse
    groupRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={groupRef} renderOrder={20}>
      <mesh material={materials.fill} renderOrder={20}>
        <circleGeometry args={[1, 56]} />
      </mesh>
      <mesh material={materials.ringInner} renderOrder={21}>
        <torusGeometry args={[1, 0.038, 12, 64]} />
      </mesh>
      <mesh material={materials.ring} renderOrder={22}>
        <torusGeometry args={[1, 0.072, 12, 64]} />
      </mesh>
    </group>
  )
}
