import { rhinoFlow } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export default function RhinoFlow() {
  const revealRef = useReveal()

  return (
    <section id="rhino">
      <div className="wrap">
        <div className="kicker">{rhinoFlow.kicker}</div>
        <h2>{rhinoFlow.title}</h2>
        <p className="lead">{rhinoFlow.lead}</p>

        <div className="flow">
          {rhinoFlow.pipeline.map((node, i) => (
            <div key={node.title} style={{ display: 'contents' }}>
              {i > 0 && <div className="arrow" aria-hidden="true">→</div>}
              <div className="node">
                <div className="mono">{node.mono}</div>
                <h4>{node.title}</h4>
                <p>{node.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="steps" ref={revealRef} style={{ marginTop: 32 }}>
          {rhinoFlow.steps.map((step) => (
            <div key={step.title} className="step">
              <h4>{step.title}</h4>
              <p>{step.body}</p>
              {step.warning && (
                <div className="callout-warning">{step.warning}</div>
              )}
              {step.image && (
                <div className="step-image">
                  <img src={step.image} alt={step.imageAlt} loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
