"use client"

import { LenisContext } from "@/context/LenisContext"
import { useContext } from "react"

export function useLenis() {
  const context = useContext(LenisContext)

  if (!context) {
    throw new Error("useLenis must be used within LenisProvider")
  }

  return context
}
