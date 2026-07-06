import MetroMap from './MetroMap'
import { getEstacionByCodigo } from '../data/estaciones'

export default function MetroStationContext({ codigo }) {
  const est = getEstacionByCodigo(codigo)
  if (!est) return null

  return (
    <div
      className="metro-station-context"
      aria-label={`Tramo del flujo: ${codigo} ${est.nombre}`}
    >
      <MetroMap contextStation={codigo} estacionActiva={codigo} />
    </div>
  )
}
