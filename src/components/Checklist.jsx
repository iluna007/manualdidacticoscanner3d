import { useState } from 'react'

const ITEMS = [
  'Batería interna cargada + batería externa de repuesto (SLAM consume más)',
  'Memoria libre suficiente en el equipo (512 GB internos, pero revisá)',
  'Hi-Survey actualizado y conectado al SL9',
  'Si usarás RTK: credenciales NTRIP a mano y SIM con datos (o radio UHF configurada)',
  'Sistema de coordenadas del proyecto elegido en Hi-Survey',
  'Plan de recorrido: por dónde empiezo, por dónde termino, pasadas con traslape',
  '¿Definí mi ruta en el mapa? (RTK/SLAM y Sat-LiDAR/CloudCompare)',
  'Al terminar: revisar la nube EN SITIO antes de guardar el equipo',
  'En oficina: procesar → limpiar → exportar E57/PTS → importar en Rhino en metros',
]

export default function Checklist() {
  const [checked, setChecked] = useState(() => ITEMS.map(() => false))
  const doneCount = checked.filter(Boolean).length

  return (
    <section id="checklist" className="checklist-section">
      <div className="wrap">
        <div className="kicker">Antes de salir a campo</div>
        <h2>Checklist rápido</h2>
        <div className="check">
          <div className="check-header">
            {doneCount} de {ITEMS.length} listos
          </div>
          {ITEMS.map((item, i) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() =>
                  setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
                }
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
