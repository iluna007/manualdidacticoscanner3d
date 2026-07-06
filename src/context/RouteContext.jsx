import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { conexiones } from '../data/estaciones'

const RouteContext = createContext(null)

export function RouteProvider({ children }) {
  const [scanLocation, setScanLocation] = useState('ambos')
  const [processing, setProcessing] = useState('unsure')
  const [scannerId, setScannerId] = useState('sl9')

  const activeStations = useMemo(() => {
    const set = new Set(['T-01', 'T-02', 'R-01'])

    if (scanLocation === 'exterior' || scanLocation === 'ambos') {
      conexiones
        .filter((c) => c.linea === 'rtk')
        .forEach((c) => {
          set.add(c.from)
          set.add(c.to)
        })
    }
    if (scanLocation === 'interior' || scanLocation === 'ambos') {
      conexiones
        .filter((c) => c.linea === 'slam')
        .forEach((c) => {
          set.add(c.from)
          set.add(c.to)
        })
    }

    if (processing === 'satlidar' || processing === 'unsure') {
      conexiones
        .filter((c) => c.linea === 'satlidar')
        .forEach((c) => {
          set.add(c.from)
          set.add(c.to)
        })
    }
    if (processing === 'cloudcompare' || processing === 'unsure') {
      conexiones
        .filter((c) => c.linea === 'cloudcompare')
        .forEach((c) => {
          set.add(c.from)
          set.add(c.to)
        })
    }

    if (processing !== 'unsure') {
      const inactiveLinea = processing === 'satlidar' ? 'cloudcompare' : 'satlidar'
      conexiones
        .filter((c) => c.linea === inactiveLinea)
        .forEach((c) => {
          set.delete(c.from)
          set.delete(c.to)
        })
      if (processing === 'satlidar') {
        ;['M-01', 'M-02', 'M-03'].forEach((c) => set.delete(c))
      } else {
        ;['N-01', 'N-02'].forEach((c) => set.delete(c))
      }
    }

    return set
  }, [scanLocation, processing])

  const activeConnections = useMemo(() => {
    return conexiones.filter((c) => {
      if (c.linea === 'shared') return true
      if (c.from === 'T-01' || c.to === 'T-01') {
        if (c.linea === 'rtk' && scanLocation === 'interior') return false
        if (c.linea === 'slam' && scanLocation === 'exterior') return false
        if (c.linea === 'satlidar' && processing === 'cloudcompare') return false
        if (c.linea === 'cloudcompare' && processing === 'satlidar') return false
        return true
      }
      return activeStations.has(c.from) && activeStations.has(c.to)
    })
  }, [activeStations, scanLocation, processing])

  const routeBanner = useMemo(() => {
    const codes = []
    if (scanLocation === 'exterior' || scanLocation === 'ambos') {
      codes.push('V-01', '…', 'V-06')
    }
    if (scanLocation === 'interior' || scanLocation === 'ambos') {
      if (scanLocation === 'ambos') codes.push('|')
      codes.push('A-01', '…', 'A-05')
    }
    codes.push('T-01')
    if (processing === 'satlidar' || processing === 'unsure') {
      codes.push('N-01', '…', 'N-02')
    }
    if (processing === 'cloudcompare' || processing === 'unsure') {
      if (processing === 'unsure' && codes.includes('N-02')) codes.push('|')
      codes.push('M-01', '…', 'M-03')
    }
    codes.push('T-02', 'R-01')
    const count = [...activeStations].filter((c) => !c.startsWith('…')).length
    return { text: codes.join(' → '), count }
  }, [scanLocation, processing, activeStations])

  const isStationActive = useCallback(
    (codigo) => activeStations.has(codigo),
    [activeStations],
  )

  const value = {
    scanLocation,
    setScanLocation,
    processing,
    setProcessing,
    scannerId,
    setScannerId,
    activeStations,
    activeConnections,
    routeBanner,
    isStationActive,
  }

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
}

export function useRoute() {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useRoute must be used within RouteProvider')
  return ctx
}
