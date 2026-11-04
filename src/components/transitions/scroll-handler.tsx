"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import scrollToSection from "@/lib/scroll-to-section"

export default function ScrollHandler({
  offset,
  param,
}: {
  offset?: number
  param?: string
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const target = searchParams.get(param || "s")
    if (!target) return

    const t = setTimeout(() => {
      scrollToSection(target, offset)
    }, 300)

    return () => clearTimeout(t)
  }, [searchParams])

  return null
}
