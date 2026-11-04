"use client"

import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useLenis } from "@/hooks/useLenis"

type PageTransitionProps = {
  label: string
}

export default function GeneralTransition({ label }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    setMounted(true)
  }, [])

  useGSAP(
    () => {
      if (!mounted) return

      document.documentElement.style.overflowY = "hidden"
      document.body.style.overflowY = "hidden"
      lenis.stop()

      gsap.set(containerRef.current, { pointerEvents: "auto" })

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflowY = "unset"
          document.body.style.overflowY = "unset"
          gsap.set(containerRef.current, { pointerEvents: "none" })
          lenis.start()
        },
      })

      tl.to(textRef.current, {
        delay: 1,
        duration: 0.6,
        opacity: 0,
        ease: "power1.inOut",
      }).fromTo(
        ".strip-col",
        { yPercent: 0 },
        {
          yPercent: -100,
          ease: "none",
          stagger: {
            amount: 0.3,
            from: "start",
          },
        },
        "<",
      )

      return () => {
        document.documentElement.style.overflowY = "unset"
        document.body.style.overflowY = "unset"
      }
    },
    { scope: containerRef, dependencies: [mounted] },
  )

  if (!mounted) return null

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-500 flex h-dvh w-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative h-full w-full overflow-hidden">
            <div className="strip-col bg-foreground border-background/20 h-full w-full border-r" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div
          ref={textRef}
          className="font-nunito text-background text-center text-[15vw] leading-none font-bold sm:text-[10vw]"
          style={{
            clipPath: "inset(0% 0% 0% 0%)",
            fontSize: "clamp(1rem, 9vw, 8rem)",
          }}
        >
          {label}
        </div>
      </div>
    </div>,
    document.body,
  )
}
