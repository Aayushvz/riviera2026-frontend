"use client"

import React, { useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import gsap from "gsap"

const startPositions = [
  { x: "0vw", y: "-100vh" }, // top
  { x: "-100vw", y: "100vh" }, // bottom-left
  { x: "100vw", y: "100vh" }, // bottom-right
  { x: "-100vw", y: "-100vh" }, // top-left
  { x: "100vw", y: "-100vh" }, // top-right
  { x: "0vw", y: "100vh" }, // bottom
]

const getRandomStartPosition = () => {
  const idx = Math.floor(Math.random() * startPositions.length)
  return startPositions[idx]
}

const ANIMATION_DURATION = 5
const STAGGER_DELAY = 1.5
const SPEED_INTENSITY = 1
const STRIPS_COUNT = 25

interface Artist {
  src: string
  alt: string
}

interface ArtistsAnimationProps {
  artists: Artist[]
}

const ArtistsAnimation = ({ artists }: ArtistsAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const rectsRefs = useRef<(SVGRectElement | null)[][]>([])

  const currentIndexRef = useRef(0)
  const animatingRef = useRef<Set<number>>(new Set())

  useMemo(() => {
    rectsRefs.current = artists.map(() => [])
  }, [artists.length])

  const animateImage = useCallback(
    (index: number) => {
      const wrapperEl = imageRefs.current[index]
      const rects = rectsRefs.current[index]

      if (!wrapperEl || !rects) return

      if (animatingRef.current.has(index)) return
      animatingRef.current.add(index)

      const startPos = getRandomStartPosition()

      gsap.killTweensOf(wrapperEl)
      rects.forEach((rect) => gsap.killTweensOf(rect))

      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current.delete(index)
        },
      })

      const cycleTime = artists.length * STAGGER_DELAY
      const moveDuration = Math.min(
        ANIMATION_DURATION,
        Math.max(1, cycleTime - 0.2),
      )
      const exitStartAt = moveDuration * 0.7

      // Reset state
      gsap.set(wrapperEl, {
        opacity: 1,
        scale: 3,
        x: startPos.x,
        y: startPos.y,
      })
      // partial reset for rects to ensure they are full width
      gsap.set(rects, { attr: { x: 0, width: 1 } })

      // Entrance & Move
      tl.to(wrapperEl, {
        scale: 0.3,
        x: "0%",
        y: "0%",
        duration: moveDuration,
        ease: `power${SPEED_INTENSITY}.inOut`,
      })

      // Slice Exit
      tl.to(
        rects,
        {
          attr: { x: 0.5, width: 0 },
          duration: moveDuration * 0.2,
          ease: "power3.in",
          stagger: {
            each: 0.02,
            from: "random",
          },
        },
        exitStartAt,
      )

      tl.set(wrapperEl, { opacity: 0 })
    },
    [artists.length],
  )

  useEffect(() => {
    if (!containerRef.current || artists.length === 0) return

    const startNextImage = () => {
      const index = currentIndexRef.current
      currentIndexRef.current = (currentIndexRef.current + 1) % artists.length
      animateImage(index)
    }

    startNextImage()
    const interval = setInterval(startNextImage, STAGGER_DELAY * 1000)

    return () => {
      clearInterval(interval)
      imageRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el)
      })
    }
  }, [animateImage])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-5"
    >
      {artists.map((artist, index) => {
        const clipId = `artist-clip-${index}`
        return (
          <div
            key={index}
            ref={(el) => {
              imageRefs.current[index] = el
            }}
            className="absolute top-1/2 left-1/2 flex aspect-square w-[40vw] -translate-x-1/2 -translate-y-1/2 transform-gpu items-center justify-center md:w-[25vw] lg:w-[15vw]"
            style={{
              opacity: 0,
            }}
          >
            <svg
              className="absolute h-0 w-0 overflow-hidden"
              aria-hidden="true"
            >
              <defs>
                <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                  {Array.from({ length: STRIPS_COUNT }).map((_, sIdx) => {
                    const height = 1 / STRIPS_COUNT
                    const y = sIdx * height
                    const rectHeight = height + 0.001

                    return (
                      <rect
                        key={sIdx}
                        ref={(el) => {
                          if (!rectsRefs.current[index])
                            rectsRefs.current[index] = []
                          rectsRefs.current[index][sIdx] = el
                        }}
                        y={y}
                        height={rectHeight}
                        x="0"
                        width="1"
                      />
                    )
                  })}
                </clipPath>
              </defs>
            </svg>

            <div
              className="h-full w-full"
              style={{
                clipPath:
                  "polygon(10% 0%, 90% 0%, 90% 5%, 95% 5%, 95% 10%, 100% 10%, 100% 90%, 95% 90%, 95% 95%, 90% 95%, 90% 100%, 10% 100%, 10% 95%, 5% 95%, 5% 90%, 0% 90%, 0% 10%, 5% 10%, 5% 5%, 10% 5%)",
              }}
            >
              <div
                className="relative h-full w-full"
                style={{ clipPath: `url(#${clipId})` }}
              >
                <Image
                  src={artist.src}
                  alt={artist.alt}
                  fill
                  className="object-cover"
                  priority={index < 2}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ArtistsAnimation
