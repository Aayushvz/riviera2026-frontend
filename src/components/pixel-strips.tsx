"use client"

import React, { useRef, useId, useMemo } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type PixelStripsProps = {
  src: string
  className?: string
  stripsCount?: number
}

const PixelStrips = ({
  src,
  className = "",
  stripsCount = 15,
}: PixelStripsProps) => {
  const container = useRef<HTMLDivElement | null>(null)
  const rectRefs = useRef<(SVGRectElement | null)[]>([])

  const deviceWidth = typeof window !== "undefined" ? window.innerWidth : 1920

  const clipId = useId().replace(/:/g, "")

  const strips = useMemo(
    () => Array.from({ length: stripsCount }),
    [stripsCount],
  )

  useGSAP(
    () => {
      const targets = rectRefs.current.filter(Boolean)
      gsap.fromTo(
        targets,
        {
          attr: { x: 0.5, width: 0 },
        },
        {
          attr: { x: 0, width: 1 },
          duration: 1.5,
          ease: "power3.inOut",
          stagger: {
            each: 0.05,
            from: "center",
          },
          scrollTrigger:
            deviceWidth >= 768
              ? {
                  trigger: container.current,
                  start: "top 80%",
                  end: "top 20%",
                  once: true,
                  markers: false,
                }
              : null,
        },
      )
    },
    { scope: container, dependencies: [stripsCount] },
  )

  return (
    <div className={`clip-path-glitch flex items-center justify-center`}>
      <div ref={container} className={`relative overflow-hidden ${className}`}>
        <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              {strips.map((_, index) => {
                // Calculate height as a decimal (0 to 1)
                const height = 1 / stripsCount
                const y = index * height

                const rectHeight = height + 0.0005

                return (
                  <rect
                    key={index}
                    ref={(el) => {
                      if (el) rectRefs.current[index] = el
                    }}
                    y={y}
                    height={rectHeight}
                    x="0.5"
                    width="0"
                  />
                )
              })}
            </clipPath>
          </defs>
        </svg>

        <video
          src={src}
          className="h-full w-full object-cover"
          style={{ clipPath: `url(#${clipId})` }}
          height={1000}
          width={1000}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  )
}

export default PixelStrips
