"use client"

import { createContext, useEffect, useRef, ReactNode } from "react"
import Lenis from "lenis"

interface LenisContextValue {
  lenis: Lenis | null
  stop: () => void
  start: () => void
}

export const LenisContext = createContext<LenisContextValue | null>(null)

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const value: LenisContextValue = {
    lenis: lenisRef.current,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
