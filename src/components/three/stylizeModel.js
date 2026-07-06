import * as THREE from 'three'
import { getScannerPalette } from './scannerPalette'

function disposeMaterial(mat) {
  if (!mat) return
  ;['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach((key) => {
    if (mat[key]) mat[key].dispose()
  })
  mat.dispose?.()
}

function makeMat(color, palette, { metalness = 0.22, roughness = 0.48 } = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity: 0.85,
  })
}

/** Materiales por tema — sin texturas, con contraste real (no lavado). */
export function stylizeScannerMesh(root, theme = 'day') {
  const p = getScannerPalette(theme)
  const body = makeMat(p.body, p)
  const shade = makeMat(p.shade, p, { metalness: 0.35, roughness: 0.4 })
  const grip = makeMat(p.grip, p, { metalness: 0.08, roughness: 0.72 })
  const lens = makeMat(p.lens, p, { metalness: 0.45, roughness: 0.32 })
  const accent = makeMat(p.accent, p, { metalness: 0.3, roughness: 0.45 })

  root.traverse((child) => {
    if (!child.isMesh) return

    const name = (child.name || '').toLowerCase()
    let material = body
    if (name.includes('lens') || name.includes('glass') || name.includes('lidar')) {
      material = lens
    } else if (name.includes('grip') || name.includes('rubber') || name.includes('black')) {
      material = grip
    } else if (name.includes('metal') || name.includes('cap')) {
      material = shade
    } else if (name.includes('screen') || name.includes('led') || name.includes('light')) {
      material = accent
    }

    const prev = child.material
    if (Array.isArray(prev)) prev.forEach(disposeMaterial)
    else disposeMaterial(prev)

    child.material = material
    child.castShadow = true
    child.receiveShadow = false

    if (child.geometry) {
      child.geometry.computeVertexNormals()
    }
  })

  return root
}
