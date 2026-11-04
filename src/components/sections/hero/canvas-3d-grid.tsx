"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface Point {
  x: number
  y: number
}

interface Box {
  x: number
  y: number
  z: number
  opacity: number
}

interface RenderableFace {
  p: [Point, Point, Point, Point]
  c: string
  s: string
  w: number
  o: number
  z: number
}

interface Canvas3DGridProps {
  gridCount?: number
  boxSize?: number
  boxDepth?: number
  faceColor?: string
  sideColor?: string
  scrollHeight?: string
  BackgroundComponent?: React.ComponentType
}

export default function Canvas3DGrid({
  gridCount = 8,
  boxSize = 120,
  boxDepth = 50,
  faceColor = "#a67eff",
  sideColor = "#ff57f8",
  scrollHeight = "400vh",
  BackgroundComponent,
}: Canvas3DGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const boxesRef = useRef<Box[]>([])
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const resizeTimeoutRef = useRef<number>()
  const isFirefoxRef = useRef<boolean>(false)
  const focalLength = 500
  const centerOffset = gridCount / 2 - 0.5
  const targetFPS = 60
  const frameInterval = 1000 / targetFPS
  const firefoxFrameInterval = 1000 / 30 // Lower FPS for Firefox

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Detect Firefox
    isFirefoxRef.current =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox")

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Better performance on some browsers
      willReadFrequently: false,
    })
    if (!ctx) return

    let width: number, height: number, centerX: number, centerY: number

    // Pre-allocate arrays
    const boxes: Box[] = []
    const faces: RenderableFace[] = new Array(gridCount * gridCount * 5)
    let faceCount = 0

    // Initialize Grid
    for (let row = 0; row < gridCount; row++) {
      for (let col = 0; col < gridCount; col++) {
        boxes.push({
          x: (col - centerOffset) * boxSize,
          y: (row - centerOffset) * boxSize,
          z: 0,
          opacity: 1,
        })
      }
    }
    boxesRef.current = boxes

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2) // Cap at 2x for performance
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      centerX = width / 2
      centerY = height / 2
    }

    const draw = (currentTime: number) => {
      // Frame rate throttling - more aggressive for Firefox
      const elapsed = currentTime - lastFrameTimeRef.current
      const interval = isFirefoxRef.current
        ? firefoxFrameInterval
        : frameInterval

      if (elapsed < interval) {
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      lastFrameTimeRef.current = currentTime - (elapsed % interval)

      // Use requestIdleCallback for non-critical work on Firefox
      const renderFrame = () => {
        ctx.clearRect(0, 0, width, height)
        faceCount = 0

        // Collect visible faces
        for (let i = 0; i < boxes.length; i++) {
          const box = boxes[i]
          if (box.z <= -focalLength || box.opacity <= 0) continue

          const scale = focalLength / (focalLength + box.z)
          const backScale = focalLength / (focalLength + box.z + boxDepth)

          const w = boxSize * scale
          const h = boxSize * scale
          const x = centerX + box.x * scale - w * 0.5
          const y = centerY + box.y * scale - h * 0.5

          // Frustum culling - skip if completely off-screen
          if (x + w < 0 || x > width || y + h < 0 || y > height) continue

          const bw = boxSize * backScale
          const bh = boxSize * backScale
          const bx = centerX + box.x * backScale - bw * 0.5
          const by = centerY + box.y * backScale - bh * 0.5

          const avgZ = box.z + boxDepth * 0.5

          // Reduce face count for Firefox - only render visible faces
          const isFirefox = isFirefoxRef.current

          // Top (only if needed)
          if (!isFirefox || by < y) {
            faces[faceCount++] = {
              p: [
                { x, y },
                { x: x + w, y },
                { x: bx + bw, y: by },
                { x: bx, y: by },
              ],
              c: sideColor,
              s: "#303030",
              w: 1,
              o: box.opacity,
              z: avgZ,
            }
          }

          // Bottom (only if needed)
          if (!isFirefox || by + bh > y + h) {
            faces[faceCount++] = {
              p: [
                { x, y: y + h },
                { x: x + w, y: y + h },
                { x: bx + bw, y: by + bh },
                { x: bx, y: by + bh },
              ],
              c: sideColor,
              s: "#303030",
              w: 1,
              o: box.opacity,
              z: avgZ,
            }
          }

          // Left (only if needed)
          if (!isFirefox || bx < x) {
            faces[faceCount++] = {
              p: [
                { x, y },
                { x, y: y + h },
                { x: bx, y: by + bh },
                { x: bx, y: by },
              ],
              c: sideColor,
              s: "#303030",
              w: 1,
              o: box.opacity,
              z: avgZ,
            }
          }

          // Right (only if needed)
          if (!isFirefox || bx + bw > x + w) {
            faces[faceCount++] = {
              p: [
                { x: x + w, y },
                { x: x + w, y: y + h },
                { x: bx + bw, y: by + bh },
                { x: bx + bw, y: by },
              ],
              c: sideColor,
              s: "#303030",
              w: 1,
              o: box.opacity,
              z: avgZ,
            }
          }

          // Front (always visible)
          faces[faceCount++] = {
            p: [
              { x, y },
              { x: x + w, y },
              { x: x + w, y: y + h },
              { x, y: y + h },
            ],
            c: faceColor,
            s: "#000",
            w: Math.max(0.5, 1.5 * scale),
            o: box.opacity,
            z: box.z,
          }
        }

        // Sort visible faces
        faces.length = faceCount
        faces.sort((a, b) => b.z - a.z)

        // Render - batch by style to reduce state changes
        let currentFillStyle = ""
        let currentStrokeStyle = ""
        let currentLineWidth = -1

        for (let i = 0; i < faceCount; i++) {
          const f = faces[i]

          // Only update styles when they change
          if (f.c !== currentFillStyle) {
            currentFillStyle = f.c
            ctx.fillStyle = f.c
          }
          if (f.s !== currentStrokeStyle) {
            currentStrokeStyle = f.s
            ctx.strokeStyle = f.s
          }
          if (f.w !== currentLineWidth) {
            currentLineWidth = f.w
            ctx.lineWidth = f.w
          }

          ctx.globalAlpha = f.o

          ctx.beginPath()
          ctx.moveTo(f.p[0].x, f.p[0].y)
          ctx.lineTo(f.p[1].x, f.p[1].y)
          ctx.lineTo(f.p[2].x, f.p[2].y)
          ctx.lineTo(f.p[3].x, f.p[3].y)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }

        ctx.globalAlpha = 1
      }

      renderFrame()
    }

    const animate = (currentTime: number) => {
      draw(currentTime)

      // For Firefox, yield to the browser more frequently to prevent blocking
      if (isFirefoxRef.current) {
        // Use setTimeout(0) occasionally to yield to other tasks
        if (Math.random() < 0.1) {
          setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(animate)
          }, 0)
        } else {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // Animation setup
    const distanceGroups: number[][] = []
    const center = gridCount / 2

    boxes.forEach((_, i) => {
      const col = i % gridCount
      const row = Math.floor(i / gridCount)
      const dx = col - Math.random() * gridCount + 0.5
      const dy = row - Math.random() * gridCount + 0.5
      const distIndex = Math.floor(Math.sqrt(dx * dx + dy * dy))

      if (!distanceGroups[distIndex]) distanceGroups[distIndex] = []
      distanceGroups[distIndex].push(i)
    })

    distanceGroups.forEach((group) => {
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[group[i], group[j]] = [group[j], group[i]]
      }
    })

    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: isFirefoxRef.current ? 0.5 : 1.2, // Smoother scrub for Firefox
        pin: true,
        invalidateOnRefresh: true,
        fastScrollEnd: true, // Improve scroll performance
      },
    })

    distanceGroups.forEach((group, distIndex) => {
      group.forEach((i, posInGroup) => {
        const box = boxes[i]
        const col = i % gridCount
        const row = Math.floor(i / gridCount)
        const delay = distIndex * 0.08 + posInGroup * 0.02

        mainTl.to(
          box,
          {
            z: -2500 - Math.random() * 1000,
            x: box.x + (col - center) * 600 + (Math.random() - 0.5) * 400,
            y: box.y + (row - center) * 600 + (Math.random() - 0.5) * 400,
            opacity: 0.7,
            duration: 0.6,
            ease: "power2.in",
          },
          delay,
        )
      })
    })

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        resize()
        ScrollTrigger.refresh()
      }, 150) as unknown as number
    }

    window.addEventListener("resize", handleResize)
    resize()
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      mainTl.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [gridCount, boxSize, boxDepth, faceColor, sideColor])

  return (
    <div
      ref={containerRef}
      style={{
        height: scrollHeight,
        position: "relative",
        contain: "layout style paint", // CSS containment for better performance
      }}
    >
      <canvas
        className="z-10"
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "transparent",
          willChange: "transform",
          transform: "translateZ(0)", // Force hardware acceleration
          imageRendering: "auto",
          isolation: "isolate", // Create new stacking context
          contain: "layout style paint", // Isolate rendering
        }}
      />
      <div
        className="absolute z-0 h-screen w-full"
        style={{
          willChange: "auto", // Don't composite background unnecessarily
        }}
      >
        {BackgroundComponent ? <BackgroundComponent /> : null}
      </div>
    </div>
  )
}
