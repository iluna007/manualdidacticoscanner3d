import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElementNS(_ns, tag) {
      const el = {
        tagName: tag,
        style: {},
        setAttribute() {},
        removeAttribute() {},
        appendChild() {},
        listeners: {},
        addEventListener(type, cb) {
          el.listeners[type] = cb
          if (type === 'load') setTimeout(() => cb({ target: el }), 0)
        },
        removeEventListener(type, cb) {
          if (el.listeners[type] === cb) delete el.listeners[type]
        },
        set src(_v) {},
      }
      return el
    },
  }
}

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer?.() ?? new ArrayBuffer(0)).then((buffer) => {
        this.result = buffer
        this.onloadend?.({ target: this })
      })
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const fbxPath =
  process.argv[2] ||
  path.join(
    root,
    'public/models/lidar-sensor-import/tripo_convert_ff65161f-c220-4e40-9dd4-bbdfc3743a04.fbx',
  )
const outPath = process.argv[3] || path.join(root, 'public/models/lidar-sensor.raw.glb')

async function exportGroup(group) {
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = maxDim > 0 ? 1 / maxDim : 1

  group.position.sub(center)
  group.scale.setScalar(scale)

  let meshCount = 0
  group.traverse((child) => {
    if (!child.isMesh) return
    meshCount += 1
    child.geometry?.computeVertexNormals()
    child.material = new THREE.MeshStandardMaterial({
      color: '#9a9ea6',
      metalness: 0.2,
      roughness: 0.5,
    })
  })
  console.log('Meshes:', meshCount, 'BBox:', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2))

  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(group, { binary: true })
  const out = Buffer.from(result)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, out)
  console.log('Exported', outPath, `(${(out.length / 1024 / 1024).toFixed(2)} MB)`)
}

async function main() {
  if (!fs.existsSync(fbxPath)) {
    console.error('FBX not found:', fbxPath)
    console.error('Place the Tripo export in public/models/lidar-sensor-import/ and re-run.')
    process.exit(1)
  }

  const fbxDir = `${path.dirname(fbxPath)}${path.sep}`
  const buffer = fs.readFileSync(fbxPath)
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

  const loader = new FBXLoader()
  loader.setResourcePath(fbxDir)

  console.log('Parsing FBX…')
  const group = loader.parse(arrayBuffer, fbxDir)
  await exportGroup(group)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
