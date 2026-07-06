import { useRoute } from '../context/RouteContext'

export default function RouteBanner() {
  const { routeBanner } = useRoute()
  return (
    <div className="route-banner mono" aria-live="polite">
      {routeBanner.text} · {routeBanner.count} estaciones
    </div>
  )
}
