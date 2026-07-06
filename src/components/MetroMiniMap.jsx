import { useState } from 'react'
import MetroMap from './MetroMap'

export default function MetroMiniMap({ estacionActiva, onStationClick, onOpenPlanner }) {
  const [expanded, setExpanded] = useState(false)

  if (expanded) {
    return (
      <div className="metro-minimap-overlay" role="dialog" aria-label="Mapa expandido">
        <button
          type="button"
          className="metro-minimap-close"
          aria-label="Cerrar mapa expandido"
          onClick={() => setExpanded(false)}
        >
          ✕
        </button>
        <MetroMap
          estacionActiva={estacionActiva}
          onStationClick={(code) => {
            onStationClick(code)
            setExpanded(false)
          }}
        />
        <button type="button" className="metro-minimap-planner" onClick={onOpenPlanner}>
          Cambiar ruta
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="metro-minimap metro-minimap--pulse"
      aria-label={`Minimapa del recorrido. Estación actual: ${estacionActiva}. Clic para expandir.`}
      onClick={() => setExpanded(true)}
    >
      <MetroMap
        estacionActiva={estacionActiva}
        onStationClick={onStationClick}
        compact
      />
    </button>
  )
}
