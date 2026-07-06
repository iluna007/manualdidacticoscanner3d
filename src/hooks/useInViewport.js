import { useEffect, useRef, useState } from 'react'

export function useInViewport(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '100px', ...options },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView]
}
