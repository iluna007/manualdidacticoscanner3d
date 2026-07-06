import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const RTK_COLOR = '#1a1a1a'
const SLAM_COLOR = '#666666'

function House({ color = '#CFC9BD' }) {
  return (
    <group>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.6, 1, 4]} />
        <meshStandardMaterial color="#8A8578" />
      </mesh>
    </group>
  )
}

function GridLabels({ mode, animateJoin }) {
  const ghostRef = useRef()

  useFrame(() => {
    if (ghostRef.current && animateJoin) {
      ghostRef.current.position.x = THREE.MathUtils.lerp(ghostRef.current.position.x, 0, 0.02)
      ghostRef.current.position.z = THREE.MathUtils.lerp(ghostRef.current.position.z, 0, 0.02)
      ghostRef.current.material.opacity = THREE.MathUtils.lerp(ghostRef.current.material.opacity, 0.3, 0.02)
    }
  })

  if (mode === 'rtk') {
    return (
      <group>
        <House />
        <mesh position={[3, 0.75, 1]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" transparent opacity={0.35} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <House color="#999999" />
      <mesh ref={ghostRef} position={[4, 0.75, 2]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color={RTK_COLOR} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function Scene({ mode, animateJoin, inView }) {
  const color = mode === 'rtk' ? RTK_COLOR : SLAM_COLOR
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#3a3530" />
      </mesh>
      <gridHelper args={[8, 8, color, '#4a4540']} position={[0, 0.02, 0]} />
      <GridLabels mode={mode} animateJoin={animateJoin} />
      <OrbitControls enablePan={false} enabled={inView} />
    </>
  )
}

export default function CoordinateDemo({ inView = true }) {
  const [animateJoin, setAnimateJoin] = useState(false)

  return (
    <div className="coordinate-demo">
      <div className="coordinate-demo__panel coordinate-demo__panel--rtk">
        <div className="coordinate-demo__label mono" style={{ color: RTK_COLOR }}>
          RTK · Coordenadas reales
        </div>
        <div className="coordinate-demo__coords mono">N 1 098 450 · E 488 210</div>
        <Canvas
          camera={{ position: [5, 4, 5], fov: 45 }}
          frameloop={inView ? 'always' : 'demand'}
          style={{ background: '#2B2620', height: 420 }}
        >
          <Scene mode="rtk" animateJoin={false} inView={inView} />
        </Canvas>
        <p className="coordinate-demo__msg">
          Tu escaneo ya sabe dónde está en el mundo; se une solo con otros datos.
        </p>
      </div>

      <div className="coordinate-demo__panel coordinate-demo__panel--slam">
        <div className="coordinate-demo__label mono" style={{ color: SLAM_COLOR }}>
          SLAM · Coordenadas locales
        </div>
        <div className="coordinate-demo__coords mono">0, 0, 0 en la puerta</div>
        <Canvas
          camera={{ position: [5, 4, 5], fov: 45 }}
          frameloop={inView ? 'always' : 'demand'}
          style={{ background: '#2B2620', height: 420 }}
        >
          <Scene mode="slam" animateJoin={animateJoin} inView={inView} />
        </Canvas>
        <p className="coordinate-demo__msg">
          Sabe su forma exacta; el &quot;dónde&quot; lo decidís vos en Rhino (Move/Rotate).
        </p>
      </div>

      <button
        type="button"
        className="coordinate-demo__join"
        aria-label="Animar georreferenciación posterior"
        onClick={() => setAnimateJoin(true)}
      >
        ¿Y si los quiero juntar?
      </button>
    </div>
  )
}
