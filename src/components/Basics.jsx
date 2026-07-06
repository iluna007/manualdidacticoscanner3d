import { Suspense, lazy } from 'react'
import { basics } from '../data/content'

const ScanDemo = lazy(() => import('./three/ScanDemo'))

export default function Basics() {
  return (
    <section id="basico">
      <div className="wrap">
        <div className="kicker">{basics.kicker}</div>
        <h2>{basics.title}</h2>
        <p className="lead">{basics.lead}</p>

        <div className="basics-grid">
          <div className="cards">
            {basics.cards.map((card) => (
              <div key={card.title} className="card">
                <span className={`tag ${card.tagClass}`}>{card.tag}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
          <div className="basics-image">
            <img
              src="/img/equipo-detalle.jpg"
              alt="Primer plano del SL9 mostrando pantalla y cámaras"
              loading="lazy"
            />
          </div>
        </div>

        <div className="scan-demo-wrap">
          <Suspense fallback={<div className="scan-demo" aria-busy="true" />}>
            <ScanDemo />
          </Suspense>
          <p className="scan-demo-caption">{basics.scanCaption}</p>
        </div>
      </div>
    </section>
  )
}
