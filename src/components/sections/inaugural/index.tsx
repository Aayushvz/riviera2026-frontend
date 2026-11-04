"use client"
import MarqueeCustom from "@/components/marquee"
import Image from "next/image"
import React, { useEffect, useState } from "react"

export default function Inauguration() {
  const [hoveredBox, setHoveredBox] = useState(null as string | null)
  const [squareSize, setSquareSize] = useState(200)

  // Configuration: Number of columns for desktop and mobile
  const DESKTOP_COLUMNS = 6
  const MOBILE_COLUMNS = 4
  const scaleY = 1.4

  useEffect(() => {
    const calculateSquareSize = () => {
      // Get viewport dimensions
      const vw = window.innerWidth

      // Determine columns based on screen size
      const isMobile = vw < 768
      const columns = isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS

      // Calculate square size based on columns fitting the FULL width
      const widthBasedSize = Math.floor(vw / columns)

      // Set minimum size
      const finalSize = Math.max(60, widthBasedSize)

      setSquareSize(finalSize)
    }

    calculateSquareSize()
    window.addEventListener("resize", calculateSquareSize)

    return () => window.removeEventListener("resize", calculateSquareSize)
  }, [DESKTOP_COLUMNS, MOBILE_COLUMNS])

  return (
    <div className="relative">
      <MarqueeCustom words={["RIVIERA", "2026"]} direction="right" />
      <div className="border-primary relative flex min-h-screen items-center overflow-hidden border-b-[20px] bg-[#F9EFED]">
        {/* Grid Background - Desktop (Full width responsive squares from bottom up) */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute right-0 bottom-0 left-0 flex flex-col-reverse">
            {/* Row 30- Bottom full row */}
            <div
              className="grid border-collapse gap-0"
              style={{
                height: `${squareSize / scaleY}px`,
                gridTemplateColumns: `repeat(${DESKTOP_COLUMNS}, 1fr)`,
              }}
            >
              {[...Array(DESKTOP_COLUMNS)].map((_, i) => (
                <div
                  key={`r4-${i}`}
                  className={`cursor-pointer border-r border-b border-gray-500 transition-all duration-500`}
                  style={{
                    backgroundColor:
                      hoveredBox !== `r4-${i}`
                        ? "#FFFFFF99"
                        : i < 1 || i > DESKTOP_COLUMNS - 2
                          ? "#EBE5F4"
                          : i < 2 || i > DESKTOP_COLUMNS - 3
                            ? "#F9DEF3"
                            : "#EBE5F4",
                  }}
                  onMouseEnter={() => setHoveredBox(`r4-${i}`)}
                  onMouseLeave={() => setHoveredBox(null)}
                />
              ))}
            </div>

            {/* Row 1 */}
            <div
              className="grid gap-0"
              style={{
                height: `${squareSize / scaleY}px`,
                gridTemplateColumns: `repeat(${DESKTOP_COLUMNS}, 1fr)`,
              }}
            >
              <div className="col-span-2 grid grid-cols-2">
                {[0, 1].map((i) => (
                  <div
                    key={`r1-${i}`}
                    className="cursor-pointer border-r border-b border-gray-500 transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredBox !== `r1-${i}`
                          ? "#FFFFFF99"
                          : i === 1
                            ? "#F5EBEE"
                            : "#F9DDF4",
                    }}
                    onMouseEnter={() => setHoveredBox(`r1-${i}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                  />
                ))}
              </div>
              <div className="col-span-2 border-r border-b border-l border-gray-500 bg-transparent" />
              <div className="col-span-2 grid grid-cols-2">
                {[0, 1].map((i) => (
                  <div
                    key={`r1-r-${i}`}
                    className="cursor-pointer border-r border-b border-gray-500 transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredBox !== `r1-r-${i}`
                          ? "#FFFFFF99"
                          : i === 0
                            ? "#F5EBEE"
                            : "#F9DDF4",
                    }}
                    onMouseEnter={() => setHoveredBox(`r1-r-${i}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                  />
                ))}
              </div>
            </div>

            {/* Row - 0 Top row */}
            <div
              className="grid gap-0"
              style={{
                height: `${squareSize / scaleY}px`,
                gridTemplateColumns: `repeat(${DESKTOP_COLUMNS}, 1fr)`,
              }}
            >
              <div className="col-span-1 grid grid-cols-1">
                {[0].map((i) => (
                  <div
                    key={`r0-${i}`}
                    className="cursor-pointer border-t border-r border-b border-gray-500 transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredBox === `r0-${i}` ? "#EBE5F4" : "#FFFFFF99",
                    }}
                    onMouseEnter={() => setHoveredBox(`r0-${i}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                  />
                ))}
              </div>
              <div className="col-span-1 border-b border-l border-gray-500 bg-transparent" />
              <div className="col-span-2 border-none bg-transparent" />
              <div className="col-span-1 border-r border-b border-gray-500 bg-transparent" />
              <div className="col-span-1 grid grid-cols-1">
                {[1].map((i) => (
                  <div
                    key={`r0-r-${i}`}
                    className="cursor-pointer border-t border-r border-b border-gray-500 transition-all duration-500"
                    style={{
                      backgroundColor:
                        hoveredBox === `r0-r-${i}` ? "#EBE5F4" : "#FFFFFF99",
                    }}
                    onMouseEnter={() => setHoveredBox(`r0-r-${i}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Background - Mobile (Full width responsive) */}
        <div className="absolute inset-0 lg:hidden">
          {/* Top portion - solid color */}
          <div className="absolute top-0 right-0 left-0 h-[60%] bg-[#f5f0eb]" />

          {/* Bottom grid - 3 full rows from bottom */}
          <div className="absolute right-0 bottom-0 left-0">
            <div
              className="grid gap-0 border-t border-gray-500"
              style={{ gridTemplateColumns: `repeat(${MOBILE_COLUMNS}, 1fr)` }}
            >
              {/* Row 1 */}
              {[...Array(MOBILE_COLUMNS)].map((_, i) => (
                <div
                  key={`mb1-${i}`}
                  className="border border-r border-b border-gray-500 transition-all duration-500 ease-out"
                  style={{
                    height: `${squareSize / scaleY}px`,
                    backgroundColor:
                      hoveredBox === `mb1-${i}` ? "#EBE5F4" : "#FFFFFF99",
                  }}
                  onMouseEnter={() => setHoveredBox(`mb1-${i}`)}
                  onMouseLeave={() => setHoveredBox(null)}
                />
              ))}
              {/* Row 2 */}
              {[...Array(MOBILE_COLUMNS)].map((_, i) => (
                <div
                  key={`mb2-${i}`}
                  className="border border-r border-b border-gray-500 transition-all duration-500 ease-out"
                  style={{
                    height: `${squareSize / scaleY}px`,
                    backgroundColor:
                      hoveredBox === `mb2-${i}` ? "#EBE5F4" : "#FFFFFF99",
                  }}
                  onMouseEnter={() => setHoveredBox(`mb2-${i}`)}
                  onMouseLeave={() => setHoveredBox(null)}
                />
              ))}
              {/* Row 3 */}
              {[...Array(MOBILE_COLUMNS)].map((_, i) => (
                <div
                  key={`mb3-${i}`}
                  className="border border-r border-b border-gray-500 transition-all duration-500 ease-out"
                  style={{
                    height: `${squareSize / scaleY}px`,
                    backgroundColor:
                      hoveredBox === `mb3-${i}` ? "#F9DEF3" : "#FFFFFF99",
                  }}
                  onMouseEnter={() => setHoveredBox(`mb3-${i}`)}
                  onMouseLeave={() => setHoveredBox(null)}
                />
              ))}
              {[...Array(MOBILE_COLUMNS)].map((_, i) => (
                <div
                  key={`mb1-${i}`}
                  className="border border-r border-b border-gray-500 transition-all duration-500 ease-out"
                  style={{
                    height: `${squareSize / scaleY}px`,
                    backgroundColor:
                      hoveredBox === `mb4-${i}` ? "#EBE5F4" : "#FFFFFF99",
                  }}
                  onMouseEnter={() => setHoveredBox(`mb4-${i}`)}
                  onMouseLeave={() => setHoveredBox(null)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="font-nunito md:pd-0 pointer-events-none relative z-10 container mx-auto px-8 py-8 md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
            {/* Image Section - Left on Desktop, Top on Mobile */}
            <div className="order-2 flex w-full justify-center md:order-1 md:w-1/2 md:justify-start">
              <div className="relative">
                <div className="absolute -inset-4" />
                <div className="relative">
                  <div className="bg-primary absolute top-3 -right-3 h-full w-full" />
                  <Image
                    src="/proshows/mr.png"
                    alt="Anitha Pauldurai with Indian flag"
                    width={100}
                    height={300}
                    className="relative z-10 w-full max-w-md"
                  />
                </div>
              </div>
            </div>

            {/* Text Section - Right on Desktop, Bottom on Mobile */}
            <div className="order-1 w-full space-y-6 text-left md:order-2 md:w-1/2 md:pr-10 md:text-right">
              <div className="inline-block rounded-full border-2 border-black px-3 py-1.5">
                <span className="text-sm font-bold tracking-wider uppercase drop-shadow md:text-base">
                  Inauguration
                </span>
              </div>

              <h1 className="text-4xl leading-tight font-black md:text-6xl lg:text-7xl">
                <span className="block">KICKING IT</span>
                <span className="block">OFF WITH</span>
                <span className="block">EXCELLENCE</span>
              </h1>

              <div className="space-y-4 md:flex md:flex-col md:items-end md:text-right">
                <h2 className="text-2xl font-bold drop-shadow-2xl md:text-3xl">
                  Chief Guest: Mithali Raj
                </h2>

                <p className="mx-auto w-full max-w-xl text-base leading-relaxed text-gray-900 drop-shadow md:mx-0 md:text-right md:text-lg">
                  We’re honored to welcome an icon of determination and
                  leadership as our inaugural guest. Her remarkable journey
                  marks a powerful beginning to Riviera, setting the stage for a
                  celebration driven by grit and inspiration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
