import { decision } from '../data/content'

export default function Decision() {
  return (
    <section id="decidir">
      <div className="wrap">
        <div className="kicker">{decision.kicker}</div>
        <h2>{decision.title}</h2>
        <p className="lead">{decision.lead}</p>
        <p className="lead" style={{ marginTop: 12, fontStyle: 'italic' }}>
          Regla para dummies: {decision.rule}
        </p>

        <div className="decision">
          {decision.branches.map((branch) => (
            <div key={branch.title} className={`branch ${branch.className}`}>
              <div className="mono">{branch.mono}</div>
              <h3>{branch.title}</h3>
              <ul>
                {branch.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="branch-image">
                <img src={branch.image} alt={branch.imageAlt} loading="lazy" />
              </div>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situación</th>
                <th>Modo</th>
                <th>¿Por qué?</th>
              </tr>
            </thead>
            <tbody>
              {decision.table.map((row) => (
                <tr key={row.situation}>
                  <td>{row.situation}</td>
                  <td>{row.mode}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="aplicaciones-band">
          <img
            src="/img/aplicaciones.jpg"
            alt="Tres aplicaciones del SL9: espacio semiabierto, interior y proyecto de ingeniería"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
