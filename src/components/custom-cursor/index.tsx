"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const scaleRef = useRef(1)
  const rotateRef = useRef(0)

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return

    const cursor = cursorRef.current
    const cursorInner = cursorInnerRef.current
    if (!cursor || !cursorInner) return

    let rafId: number

    // Smooth animation using RAF
    const updateCursor = () => {
      // Position the cursor so the tip aligns with the mouse position
      // Assuming cursor tip is at top-left of the image
      cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`
      cursorInner.style.transform = `scale(${scaleRef.current}) rotate(${rotateRef.current}deg)`
    }

    const move = (e: MouseEvent | PointerEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateCursor()
          rafId = 0
        })
      }
    }

    const dragMove = (e: DragEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateCursor()
          rafId = 0
        })
      }
    }

    const down = () => {
      scaleRef.current = 0.75
      updateCursor()
    }

    const up = () => {
      scaleRef.current = 1
      updateCursor()
    }

    // Check if element or any parent is interactive
    const isInteractive = (element: HTMLElement | null): boolean => {
      if (!element || element === document.body) return false

      const tagName = element.tagName
      const isClickable =
        tagName === "A" ||
        tagName === "BUTTON" ||
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA"

      const hasPointerClass = element.classList.contains(
        "pointer-cursor-element",
      )
      const hasClickHandler =
        element.onclick !== null || element.getAttribute("onclick") !== null
      const hasCursorPointer =
        window.getComputedStyle(element).cursor === "pointer"

      if (
        isClickable ||
        hasPointerClass ||
        hasClickHandler ||
        hasCursorPointer
      ) {
        return true
      }

      return isInteractive(element.parentElement)
    }

    const hover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isPointer = isInteractive(target)

      if (isPointer) {
        scaleRef.current = 1.2
        rotateRef.current = 20
      } else {
        scaleRef.current = 1
        rotateRef.current = 0
      }
      updateCursor()
    }

    window.addEventListener("mousemove", move, { passive: true })
    window.addEventListener("pointermove", move as EventListener, {
      passive: true,
    })
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)
    window.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)
    window.addEventListener("mouseover", hover, { passive: true })
    window.addEventListener("drag", dragMove)
    window.addEventListener("dragover", dragMove)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("pointermove", move as EventListener)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
      window.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("mouseover", hover)
      window.removeEventListener("drag", dragMove)
      window.removeEventListener("dragover", dragMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches

  if (!isDesktop) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-999"
        style={{
          transform: "translate(0, 0)",
          willChange: "transform",
        }}
      >
        <div
          ref={cursorInnerRef}
          className="relative h-8 w-8"
          style={{
            transform: "scale(1) rotate(0deg)",
            transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
        >
          <Image src="/cursors/custom.svg" alt="cursor" fill priority />
        </div>
      </div>
    </>
  )
}
