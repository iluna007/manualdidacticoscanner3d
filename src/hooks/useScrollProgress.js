import { useEffect, useState, useCallback } from 'react'
import { estaciones } from '../data/estaciones'

export function useScrollProgress() {
  const [activeStation, setActiveStation] = useState('V-01')
  const [progress, setProgress] = useState(0)

  const scrollToStation = useCallback((codigo) => {
    const el = document.getElementById(`station-${codigo}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const sections = estaciones
      .map((e) => ({
        codigo: e.codigo,
        el: document.getElementById(`station-${e.codigo}`),
      }))
      .filter((s) => s.el)

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)

      const trigger = window.innerHeight * 0.4
      let current = sections[0]?.codigo ?? 'V-01'
      for (const { codigo, el } of sections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= trigger) current = codigo
      }
      setActiveStation(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { activeStation, progress, scrollToStation }
}
