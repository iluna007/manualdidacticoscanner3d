import { LINE_COLORS } from '../data/scanners'
import { useRoute } from '../context/RouteContext'
import MetroStationContext from './MetroStationContext'

export default function TransferStation({ estacion }) {
  const { setProcessing } = useRoute()
  const color = LINE_COLORS.transbordo

  return (
    <section
      id={`station-${estacion.codigo}`}
      className="station transfer-station"
      style={{ '--line-color': color }}
    >
      <div className="wrap station-inner">
        <div className="transfer-badge mono">◉ BIFURCACIÓN</div>
        <div className="station-header">
          <div className="station-header__main">
            <span className="station-code mono">{estacion.codigo}</span>
            <h2 className="station-title">{estacion.nombre}</h2>
            <p className="station-resumen">{estacion.resumen}</p>
          </div>
          <MetroStationContext codigo={estacion.codigo} />
        </div>

        <div className="station-body">
          <p>{estacion.cuerpo}</p>
        </div>

        {estacion.tip && <div className="station-tip">{estacion.tip}</div>}

        {estacion.comparativa && (
          <div className="table-wrap">
            <table className="comparativa-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Sat-LiDAR</th>
                  <th>CloudCompare</th>
                </tr>
              </thead>
              <tbody>
                {estacion.comparativa.map((row) => (
                  <tr key={row.aspecto}>
                    <td>{row.aspecto}</td>
                    <td>{row.satlidar}</td>
                    <td>{row.cloudcompare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="transfer-actions">
              <button
                type="button"
                className="transfer-route-btn satlidar"
                onClick={() => setProcessing('satlidar')}
              >
                Elegir flujo Sat-LiDAR
              </button>
              <button
                type="button"
                className="transfer-route-btn cloudcompare"
                onClick={() => setProcessing('cloudcompare')}
              >
                Elegir flujo CloudCompare
              </button>
            </div>
          </div>
        )}

        {estacion.formatos && (
          <div className="formatos-grid">
            {estacion.formatos.map((f) => (
              <div key={f.nombre} className="card">
                <span className="mono tag o">{f.nombre}</span>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {estacion.errorNovato && (
          <div className="station-error">⚠️ Error de novato: {estacion.errorNovato}</div>
        )}
      </div>
    </section>
  )
}
