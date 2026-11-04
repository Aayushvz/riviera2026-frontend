"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const TEXT = "RISE*RUSH*REVEL*"

function Cursor({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const opacityRef = useRef(0)
  const scaleRef = useRef(0.7)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const container = containerRef.current
    if (!cursor || !ring || !container) return
    if (!window.matchMedia("(pointer:fine)").matches) return

    let animationFrameId: number

    // Smooth interpolation for cursor position
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const updateCursor = () => {
      // Smooth position interpolation
      positionRef.current.x = lerp(
        positionRef.current.x,
        targetPositionRef.current.x,
        0.2,
      )
      positionRef.current.y = lerp(
        positionRef.current.y,
        targetPositionRef.current.y,
        0.2,
      )

      // Apply transform with centering offset
      cursor.style.transform = `translate(calc(${positionRef.current.x}px - 40%), calc(${positionRef.current.y}px - 40%))`
      cursor.style.opacity = String(opacityRef.current)
      cursor.style.scale = String(scaleRef.current)

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const move = (e: MouseEvent) => {
      const { clientX, clientY } = e

      targetPositionRef.current = {
        x: clientX,
        y: clientY,
      }

      const rect = container.getBoundingClientRect()
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom

      if (inside && !visibleRef.current) {
        visibleRef.current = true
        opacityRef.current = 1
        scaleRef.current = 1
      } else if (!inside && visibleRef.current) {
        visibleRef.current = false
        opacityRef.current = 0
        scaleRef.current = 0.7
      }
    }

    window.addEventListener("mousemove", move, { passive: true })
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener("mousemove", move)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [containerRef])

  const radius = 60
  const chars = TEXT.split("")
  const step = 360 / chars.length

  return createPortal(
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-9999"
      style={{
        transform: "translate(0, 0)",
        opacity: 0,
        scale: "0.7",
        transition: "opacity 0.2s ease-out, scale 0.2s ease-out",
        willChange: "transform, opacity, scale",
      }}
    >
      <div
        ref={ringRef}
        className="cursor-ring relative flex h-32 w-32 items-center justify-center"
        style={{
          animation: "spin 12s linear infinite",
        }}
      >
        {chars.map((char, i) => {
          const angle = i * step
          return (
            <span
              key={i}
              className="absolute text-lg leading-none font-bold text-white select-none"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                top: "50%",
                left: "50%",
              }}
            >
              {char}
            </span>
          )
        })}
      </div>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>,
    document.body,
  )
}

interface HeroCircularCursorProps {
  children: React.ReactNode
  className?: string
}

export default function HeroCircularCursor({
  children,
  className = "",
}: HeroCircularCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches

  return (
    <>
      <div ref={containerRef} className={className}>
        {children}
      </div>
      {mounted && isDesktop && <Cursor containerRef={containerRef} />}
    </>
  )
}
