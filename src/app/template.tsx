"use client"

import { usePathname } from "next/navigation"
import GeneralTransition from "@/components/transitions/general"
import path from "path"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const labelMap: Record<string, string> = {
    "/faq": "FAQs",
    "/events": "EVENTS",
    "/about": "ABOUT",
    "/external-events": "EXTERNAL EVENTS",
  }

  const excludedPaths = ["/"]
  let label

  if (excludedPaths.includes(pathname)) {
    return <>{children}</>
  }

  if (pathname.startsWith("/events/")) {
    label = "EVENTS"
  } else if (pathname.startsWith("/merch")) {
    label = "MERCH"
  } else if (pathname.startsWith("/external-events/")) {
    label = "EXTERNAL EVENTS"
  } else if (pathname.startsWith("/decor/")) {
    label = "DECOR"
  } else {
    label = labelMap[pathname] ?? pathname.replace("/", "").toUpperCase()
  }

  return (
    <>
      <GeneralTransition label={label} />
      {children}
    </>
  )
}
