import { workflowSLAM } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export default function WorkflowSLAM() {
  const revealRef = useReveal()

  return (
    <section id={workflowSLAM.id}>
      <div className="wrap">
        <div className="kicker">{workflowSLAM.kicker}</div>
        <h2>{workflowSLAM.title}</h2>
        <p className="lead">{workflowSLAM.lead}</p>

        <div className="steps" ref={revealRef}>
          {workflowSLAM.steps.map((step) => (
            <div key={step.title} className={`step ${workflowSLAM.stepClass}`}>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
              {step.tip && <div className="tip">{step.tip}</div>}
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
