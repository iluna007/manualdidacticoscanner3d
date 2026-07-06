import { workflowRTK } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export default function WorkflowRTK() {
  const revealRef = useReveal()

  return (
    <section id={workflowRTK.id}>
      <div className="wrap">
        <div className="kicker">{workflowRTK.kicker}</div>
        <h2>{workflowRTK.title}</h2>
        <p className="lead">{workflowRTK.lead}</p>

        <div className="steps" ref={revealRef}>
          {workflowRTK.steps.map((step) => (
            <div key={step.title} className={`step ${workflowRTK.stepClass}`}>
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
