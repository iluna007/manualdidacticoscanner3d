import { useState } from 'react'
import { glosario } from '../data/glosario'

export default function Glossary() {
  return (
    <section id="glosario" className="glossary-section">
      <div className="wrap">
        <div className="kicker">Diccionario de bolsillo</div>
        <h2>Glosario para no perderse</h2>
        <dl>
          {glosario.map(({ term, def }) => (
            <div key={term} className="term">
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
