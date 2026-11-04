"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function SectionTransition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const centerLineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 45%",
          toggleActions: "play none none reverse",
          once: false,
          markers: false,
        },
      })

      tl.to(textRef.current, {
        delay: 0.4,
        duration: 0.5,
        opacity: 0,
        ease: "power1.inOut",
      })
        .fromTo(
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
        .to(
          centerLineRef.current,
          {
            duration: 0.5,
            scaleY: 0,
            transformOrigin: "top",
            ease: "power1.inOut",
          },
          "<0.2",
        )
        .to(containerRef.current, {
          duration: 0.5,
          zIndex: -100,
          ease: "power1.inOut",
        })
    },
    { scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      className="relative min-h-[150vh] w-full overflow-hidden bg-transparent"
    >
      <div className="relative z-10 h-full w-full" />
      <div
        ref={centerLineRef}
        className="bg-foreground absolute left-1/2 z-60 h-full w-px"
      />

      <div className="absolute inset-0 top-0 left-0 z-50 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative h-full w-full overflow-hidden">
            <div
              className={`strip-col bg-background border-foreground h-full w-full ${i !== 2 ? "border-r" : ""}`}
            />
          </div>
        ))}
      </div>

      <div
        className={`pointer-events-none absolute inset-0 -top-100 z-60 flex items-center justify-center`}
      >
        <div
          ref={textRef}
          className="font-nunito text-foreground text-center font-bold"
          style={{
            fontSize: "clamp(1rem, 9vw, 8rem)",
          }}
        >
          PROSHOWS
        </div>
      </div>
    </div>
  )
}
