"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/all"
import { Canvas2DFlippingGridProps, Tile } from "@/app/types/props"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
}

export default function Canvas2DFlippingGrid({
  gridCount = 8,
  boxSize = 120,
  boxDepth = 50,
  faceColor = "#212121",
  sideColor = "#ff57f8",
  scrollHeight = "400vh",
  imageFolder = "/assets/hero/stars",
  imageCount = 20,
  extension = "webp",
  BackgroundComponent,
  flipCooldown = 200,
  queueDelay = 100,
  borderRadius = 10,
}: Canvas2DFlippingGridProps & { borderRadius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<Tile[]>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  const animationFrameRef = useRef<number>()
  const hasScrollStartedRef = useRef<boolean>(false)
  const loadedImagesRef = useRef<Set<number>>(new Set())

  // Performance optimization refs
  const lastFrameTimeRef = useRef<number>(0)
  const pathCacheRef = useRef<Map<string, Path2D>>(new Map())
  const dirtyTilesRef = useRef<Set<number>>(new Set())
  const isFirefoxRef = useRef<boolean>(false)

  // Queue management
  const flipQueueRef = useRef<number[]>([])
  const currentlyFlippingRef = useRef<Set<number>>(new Set())
  const isProcessingQueueRef = useRef<boolean>(false)

  // Device detection and adaptive FPS
  const targetFPS = useRef<number>(60)
  const frameInterval = useRef<number>(1000 / 60)
  const hasRenderedOnceRef = useRef<boolean>(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Detect browser and device capabilities
    isFirefoxRef.current =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox")

    // Adaptive FPS based on device
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cores = (navigator as any).hardwareConcurrency || 2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memory = (navigator as any).deviceMemory || 4

    if (cores <= 2 || memory <= 2) {
      targetFPS.current = 30 // Low-end device
    } else if (cores <= 4 || memory <= 4) {
      targetFPS.current = 45 // Mid-range device
    } else {
      targetFPS.current = 60 // High-end device
    }

    frameInterval.current = 1000 / targetFPS.current

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    })
    if (!ctx) return

    let width: number, height: number

    // Cached rounded rectangle path generator
    const getCachedRoundRect = (w: number, h: number, r: number): Path2D => {
      const key = `${Math.round(w)}-${Math.round(h)}-${r}`

      if (!pathCacheRef.current.has(key)) {
        const path = new Path2D()
        path.moveTo(r, 0)
        path.lineTo(w - r, 0)
        path.quadraticCurveTo(w, 0, w, r)
        path.lineTo(w, h - r)
        path.quadraticCurveTo(w, h, w - r, h)
        path.lineTo(r, h)
        path.quadraticCurveTo(0, h, 0, h - r)
        path.lineTo(0, r)
        path.quadraticCurveTo(0, 0, r, 0)
        path.closePath()
        pathCacheRef.current.set(key, path)
      }

      return pathCacheRef.current.get(key)!
    }

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (loadedImagesRef.current.has(index)) {
          resolve(imagesRef.current[index])
          return
        }

        const img = new Image()
        img.src = `${imageFolder}/${index + 1}.${extension}`

        img.onload = () => {
          loadedImagesRef.current.add(index)
          imagesRef.current[index] = img
          // Update the tile's image reference
          tilesRef.current.forEach((tile) => {
            if (tile.imageIndex === index) {
              tile.image = img
            }
          })
          resolve(img)
        }

        img.onerror = () => {
          console.warn(`Failed to load image: ${index + 1}.png`)
          reject(new Error(`Failed to load image ${index + 1}`))
        }
      })
    }

    // Initialize image array with placeholders
    const initImages = () => {
      imagesRef.current = new Array(imageCount).fill(null)
      // Start preloading first few images in background (non-blocking)
      const initialLoadCount = Math.min(gridCount * gridCount, imageCount)

      for (let i = 0; i < initialLoadCount; i++) {
        loadImage(i).catch(() => null) // Fire and forget
      }
    }

    // Initialize Grid
    const initGrid = () => {
      const tiles: Tile[] = []

      // Calculate tile size and grid positioning
      const totalGridSize = gridCount * boxSize
      const offsetX = (width - totalGridSize) / 2
      const offsetY = (height - totalGridSize) / 2

      for (let row = 0; row < gridCount; row++) {
        for (let col = 0; col < gridCount; col++) {
          const index = row * gridCount + col
          const imageIndex = index % imageCount

          tiles.push({
            x: offsetX + col * boxSize,
            y: offsetY + row * boxSize,
            width: boxSize,
            height: boxSize,
            rotationX: 0,
            image: imagesRef.current[imageIndex] || null,
            imageIndex: imageIndex,
            isAnimating: false,
            opacity: 1,
            lastFlipTime: 0,
          })
        }
      }

      tilesRef.current = tiles
    }

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2) // Cap at 2x for performance
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)

      // Clear path cache on resize
      pathCacheRef.current.clear()

      initGrid()

      // Mark all tiles as dirty to trigger initial render
      tilesRef.current.forEach((_, index) => {
        dirtyTilesRef.current.add(index)
      })
    }

    // Queue processing function
    const processFlipQueue = async () => {
      if (isProcessingQueueRef.current) return
      isProcessingQueueRef.current = true

      while (flipQueueRef.current.length > 0) {
        const tileIndex = flipQueueRef.current.shift()
        if (tileIndex === undefined) break

        const tile = tilesRef.current[tileIndex]
        if (!tile) continue

        const currentTime = Date.now()

        // Check if tile is on cooldown
        if (currentTime - tile.lastFlipTime < flipCooldown) {
          continue
        }

        // Check if tile is already animating
        if (currentlyFlippingRef.current.has(tileIndex)) {
          continue
        }

        // Lazy load image if not loaded yet
        if (!loadedImagesRef.current.has(tile.imageIndex)) {
          loadImage(tile.imageIndex).catch(() => {
            // Image failed to load, continue anyway
          })
        }

        // Start the flip
        animateTileFlip(tileIndex)

        // Wait for queue delay before processing next
        if (flipQueueRef.current.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, queueDelay))
        }
      }

      isProcessingQueueRef.current = false
    }

    // Mouse move handler for flip effect
    const handleMouseMove = (e: MouseEvent) => {
      if (hasScrollStartedRef.current) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Check tiles for direct hover only
      tilesRef.current.forEach((tile, index) => {
        // Check if mouse is directly over this tile
        if (
          mouseX >= tile.x &&
          mouseX <= tile.x + tile.width &&
          mouseY >= tile.y &&
          mouseY <= tile.y + tile.height
        ) {
          // Add to queue if not already queued or animating
          if (
            !flipQueueRef.current.includes(index) &&
            !currentlyFlippingRef.current.has(index)
          ) {
            flipQueueRef.current.push(index)
            processFlipQueue()
          }
        }
      })
    }

    // Enhanced flip animation - full 360 degree rotation
    const animateTileFlip = (index: number) => {
      const tile = tilesRef.current[index]
      if (!tile) return

      tile.isAnimating = true
      tile.lastFlipTime = Date.now()
      currentlyFlippingRef.current.add(index)

      // Mark tile as dirty for rendering
      dirtyTilesRef.current.add(index)

      const currentRotation = tile.rotationX

      // Full 360 degree flip with elastic easing
      gsap.to(tile, {
        rotationX: currentRotation + 360,
        duration: 2,
        ease: CustomEase.create(
          "custom",
          "M0,0 C0.02,0.062 0.077,0.424 0.237,0.496 0.464,0.619 0.453,1.012 0.567,1.052 0.673,1.088 0.742,0.963 0.836,0.927 0.899,0.903 0.956,1 1,1",
        ),
        onUpdate: () => {
          // Mark tile as dirty on each update
          dirtyTilesRef.current.add(index)
        },
        onComplete: () => {
          tile.rotationX = tile.rotationX % 360
          tile.isAnimating = false
          currentlyFlippingRef.current.delete(index)
          dirtyTilesRef.current.add(index)
        },
      })
    }

    // Optimized drawing logic with frame throttling and culling
    const draw = (currentTime: number) => {
      // Frame rate throttling
      const elapsed = currentTime - lastFrameTimeRef.current

      if (elapsed < frameInterval.current) {
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      lastFrameTimeRef.current = currentTime - (elapsed % frameInterval.current)

      // Force render on first frame, then check for dirty/animating tiles
      const hasAnimatingTiles = currentlyFlippingRef.current.size > 0
      const hasDirtyTiles = dirtyTilesRef.current.size > 0

      if (!hasRenderedOnceRef.current) {
        // Force first render to show initial state
        hasRenderedOnceRef.current = true
      } else if (!hasAnimatingTiles && !hasDirtyTiles) {
        // Skip render if nothing changed after first frame
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      // Clear and fill with background color #111
      ctx.clearRect(0, 0, width, height)

      tilesRef.current.forEach((tile, _index) => {
        if (tile.opacity <= 0) return

        // Viewport culling - skip tiles completely off-screen
        if (
          tile.x + tile.width < 0 ||
          tile.x > width ||
          tile.y + tile.height < 0 ||
          tile.y > height
        ) {
          return
        }

        const rotRad = (tile.rotationX * Math.PI) / 180
        const heightScale = Math.abs(Math.cos(rotRad))
        const showFront = Math.cos(rotRad) >= 0

        const scaledHeight = tile.height * heightScale

        ctx.save()
        ctx.globalAlpha = tile.opacity
        ctx.translate(tile.x + tile.width / 2, tile.y + tile.height / 2)

        // Add tilt/skew during rotation for 3D effect
        const tiltAmount = Math.sin(rotRad) * 0.25
        ctx.transform(1, 0, tiltAmount, 1, 0, 0)

        if (showFront) {
          // Front face (faceColor) with cached rounded corners
          const path = getCachedRoundRect(
            tile.width,
            scaledHeight,
            borderRadius,
          )
          ctx.fillStyle = faceColor
          ctx.save()
          ctx.translate(-tile.width / 2, -scaledHeight / 2)
          ctx.fill(path)
          ctx.strokeStyle = "#000"
          ctx.lineWidth = 1
          ctx.stroke(path)
          ctx.restore()
        } else {
          // Back face (image or purple background) with cached rounded corners
          const path = getCachedRoundRect(
            tile.width,
            scaledHeight,
            borderRadius,
          )

          ctx.save()
          ctx.translate(-tile.width / 2, -scaledHeight / 2)
          ctx.clip(path)

          if (tile.image && tile.image.complete) {
            // Draw image if loaded
            ctx.drawImage(tile.image, 0, 0, tile.width, scaledHeight)

            // Purple overlay on top of image
            ctx.fillStyle = "rgba(183, 128, 255, 0.5)"
            ctx.fillRect(0, 0, tile.width, scaledHeight)
          } else {
            // Show purple background if image not loaded
            ctx.fillStyle = "#a67deb"
            ctx.fillRect(0, 0, tile.width, scaledHeight)
          }

          ctx.restore()

          // Draw border
          ctx.save()
          ctx.translate(-tile.width / 2, -scaledHeight / 2)
          ctx.strokeStyle = "#000"
          ctx.lineWidth = 1
          ctx.stroke(path)
          ctx.restore()
        }

        ctx.restore()
      })

      // Clear dirty tiles set after rendering
      dirtyTilesRef.current.clear()

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resize)

    resize()
    initImages()
    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Clear queues
      flipQueueRef.current = []
      currentlyFlippingRef.current.clear()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [
    gridCount,
    boxSize,
    boxDepth,
    faceColor,
    sideColor,
    imageFolder,
    imageCount,
    flipCooldown,
    queueDelay,
    borderRadius,
  ])

  return (
    <div
      ref={containerRef}
      style={{
        height: scrollHeight,
        position: "relative",
        contain: "layout style paint",
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
          cursor: "pointer",
          willChange: "transform",
          transform: "translateZ(0)",
          isolation: "isolate",
          contain: "layout style paint",
        }}
      />
      <div className="absolute z-0 h-screen w-full">
        {BackgroundComponent ? <BackgroundComponent /> : null}
      </div>
    </div>
  )
}
